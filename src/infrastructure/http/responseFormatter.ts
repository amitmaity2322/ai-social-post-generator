import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponseBody(code: string, message: string) {
  return { success: false, error: { code, message } } as const;
}
