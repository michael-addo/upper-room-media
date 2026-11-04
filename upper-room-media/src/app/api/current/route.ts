import { NextResponse } from "next/server";
import { getOnScreen } from "@/app/lib/store";

export function GET() {
  return NextResponse.json({ onScreen: getOnScreen() });
}