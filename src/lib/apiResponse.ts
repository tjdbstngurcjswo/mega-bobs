import { NextResponse } from 'next/server';

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

export const err = (message: string, status: number, details?: unknown) =>
  NextResponse.json(
    { error: message, ...(details !== undefined ? { details } : {}) },
    { status }
  );
