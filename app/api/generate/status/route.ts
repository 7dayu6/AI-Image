import { NextRequest, NextResponse } from "next/server";
import { getGenerationJob, toGenerationResponse } from "@/lib/generationJobs";

export async function GET(request: NextRequest) {
  const jobId = new URL(request.url).searchParams.get("jobId")?.trim();
  if (!jobId) {
    return NextResponse.json({ ok: false, error: "MISSING_JOB_ID" }, { status: 400 });
  }

  const job = getGenerationJob(jobId);
  if (!job) {
    return NextResponse.json({ ok: false, jobId, error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(toGenerationResponse(job));
}
