import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getMentorStudentReviewData } from "@/lib/mentor-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MentorStudentRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: MentorStudentRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const student = await getMentorStudentReviewData(session.user.id, id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the student review right now.",
      },
      { status: 500 },
    );
  }
}
