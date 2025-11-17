import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  // For now, just pass through - authentication is handled client-side
  return NextResponse.next({
    request,
  })
}
