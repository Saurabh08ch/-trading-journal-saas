import { readFile } from "node:fs/promises";

import { NextResponse } from "next/server";

import { getMimeTypeForUpload, getUploadAbsolutePath } from "@/lib/uploads";

export const runtime = "nodejs";

type UploadRouteContext = {
  params: {
    slug: string[];
  };
};

export async function GET(_request: Request, { params }: UploadRouteContext) {
  try {
    const absolutePath = getUploadAbsolutePath(params.slug);
    const file = await readFile(absolutePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": getMimeTypeForUpload(absolutePath),
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
