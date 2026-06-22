import { NextResponse } from "next/server";
import { generateAssistantResponse } from "@/lib/mockAssistant";
import type { AssistantRequest } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as AssistantRequest;
  const response = generateAssistantResponse(body);

  return NextResponse.json(response);
}
