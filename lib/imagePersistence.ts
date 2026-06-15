import type { ChatAssistantMessage, LocalChatSession } from "@/lib/types";

const DB_NAME = "prompt-remix-image-store";
const STORE_NAME = "images";
const DB_VERSION = 1;
const STORED_IMAGE_PREFIX = "indexeddb-image:";

function isInlineImageUrl(value: string | undefined): boolean {
  return typeof value === "string" && value.startsWith("data:image/");
}

function getStoredImageKey(value: string | undefined): string | undefined {
  if (!value?.startsWith(STORED_IMAGE_PREFIX)) {
    return undefined;
  }

  return value.slice(STORED_IMAGE_PREFIX.length) || undefined;
}

function openImageDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onerror = () => reject(request.error || new Error("Failed to open image database"));
    request.onsuccess = () => resolve(request.result);
  });
}

async function writeImage(key: string, imageUrl: string): Promise<void> {
  const database = await openImageDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(imageUrl, key);

    request.onerror = () => reject(request.error || new Error("Failed to save image"));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Failed to save image transaction"));
  }).finally(() => {
    database.close();
  });
}

async function readImage(key: string): Promise<string | undefined> {
  const database = await openImageDatabase();

  return new Promise<string | undefined>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => reject(request.error || new Error("Failed to read image"));
    request.onsuccess = () => {
      resolve(typeof request.result === "string" ? request.result : undefined);
    };
  }).finally(() => {
    database.close();
  });
}

export async function createStoredImageReference(
  messageId: string,
  imageUrl: string
): Promise<string | undefined> {
  if (!isInlineImageUrl(imageUrl)) {
    return undefined;
  }

  const key = messageId;
  try {
    await writeImage(key, imageUrl);
    return `${STORED_IMAGE_PREFIX}${key}`;
  } catch {
    return undefined;
  }
}

export function hasStoredImageReferences(session: LocalChatSession): boolean {
  return session.messages.some(
    (message) => message.role === "assistant" && Boolean(getStoredImageKey(message.imageUrl))
  );
}

export function replaceInlineImagesWithReferences(
  session: LocalChatSession,
  references: Record<string, string>
): LocalChatSession {
  const messages = session.messages.map((message) => {
    if (message.role !== "assistant") {
      return message;
    }

    const reference = references[message.id];
    if (!reference) {
      return message;
    }

    return {
      ...message,
      imageUrl: reference
    } satisfies ChatAssistantMessage;
  });

  return {
    ...session,
    messages,
    lastImageUrl: undefined
  };
}

export async function resolveStoredImages(session: LocalChatSession): Promise<LocalChatSession> {
  if (!hasStoredImageReferences(session)) {
    return session;
  }

  const messages = await Promise.all(
    session.messages.map(async (message) => {
      if (message.role !== "assistant") {
        return message;
      }

      const key = getStoredImageKey(message.imageUrl);
      if (!key) {
        return message;
      }

      const imageUrl = await readImage(key).catch(() => undefined);
      if (!imageUrl) {
        return {
          ...message,
          imageUrl: undefined
        } satisfies ChatAssistantMessage;
      }

      return {
        ...message,
        imageUrl
      } satisfies ChatAssistantMessage;
    })
  );

  const lastImage = [...messages]
    .reverse()
    .find(
      (message): message is ChatAssistantMessage =>
        message.role === "assistant" && message.status === "success" && Boolean(message.imageUrl)
    );

  return {
    ...session,
    messages,
    lastImageUrl: lastImage?.imageUrl
  };
}
