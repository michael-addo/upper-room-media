import { NextResponse } from "next/server";
import { clearScreen } from "@/app/lib/store";

export function POST() {
  clearScreen();
  return NextResponse.json({ ok: true });
}