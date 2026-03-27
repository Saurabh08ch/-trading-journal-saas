import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { listStudentsForMentor } from "@/lib/mentor-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const students = await listStudentsForMentor(session.user.id);
    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load mentor students right now.",
      },
      { status: 500 },
    );
  }
}
