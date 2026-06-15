import type { GenerationResponseBody } from "@/lib/types";

export type GenerationJobStatus = "queued" | "running" | "success" | "error";

export type GenerationJob = {
  id: string;
  sessionId?: string;
  messageId?: string;
  status: GenerationJobStatus;
  imageUrl?: string;
  rewrittenPrompt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

type GlobalGenerationJobs = typeof globalThis & {
  __promptRemixGenerationJobs?: Map<string, GenerationJob>;
};

const jobStore =
  (globalThis as GlobalGenerationJobs).__promptRemixGenerationJobs ??
  new Map<string, GenerationJob>();

(globalThis as GlobalGenerationJobs).__promptRemixGenerationJobs = jobStore;

function createId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (character) =>
    (Number(character) ^ (Math.random() * 16) >> (Number(character) / 4)).toString(16)
  );
}

function now() {
  return new Date().toISOString();
}

export function createGenerationJob(input: { sessionId?: string; messageId?: string }): GenerationJob {
  const timestamp = now();
  const job: GenerationJob = {
    id: createId(),
    sessionId: input.sessionId,
    messageId: input.messageId,
    status: "queued",
    createdAt: timestamp,
    updatedAt: timestamp
  };
  jobStore.set(job.id, job);
  return job;
}

export function getGenerationJob(jobId: string): GenerationJob | undefined {
  return jobStore.get(jobId);
}

export function toGenerationResponse(job: GenerationJob): GenerationResponseBody {
  return {
    ok: job.status !== "error",
    sessionId: job.sessionId,
    messageId: job.messageId,
    jobId: job.id,
    status: job.status,
    imageUrl: job.imageUrl,
    rewrittenPrompt: job.rewrittenPrompt,
    error: job.error
  };
}

export function runGenerationJob(
  jobId: string,
  task: () => Promise<{ imageUrl: string; rewrittenPrompt: string }>
) {
  const queuedJob = jobStore.get(jobId);
  if (!queuedJob) return;

  const runningTimestamp = now();
  jobStore.set(jobId, {
    ...queuedJob,
    status: "running",
    updatedAt: runningTimestamp
  });

  task()
    .then((result) => {
      const current = jobStore.get(jobId);
      if (!current) return;

      jobStore.set(jobId, {
        ...current,
        status: "success",
        imageUrl: result.imageUrl,
        rewrittenPrompt: result.rewrittenPrompt,
        error: undefined,
        updatedAt: now()
      });
    })
    .catch((error) => {
      const current = jobStore.get(jobId);
      if (!current) return;

      jobStore.set(jobId, {
        ...current,
        status: "error",
        error: error instanceof Error ? error.message : "IMAGE_GENERATION_FAILED",
        updatedAt: now()
      });
    });
}
