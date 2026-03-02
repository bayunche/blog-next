import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const current = new URL(request.url);
    const code = current.searchParams.get('code');
    const state = current.searchParams.get('state');
    const error = current.searchParams.get('error');
    const errorDescription = current.searchParams.get('error_description');

    const params = new URLSearchParams();
    if (code) params.set('code', code);
    if (state) params.set('state', state);
    if (error) params.set('error', error);
    if (errorDescription) params.set('error_description', errorDescription);

    const location = params.toString() ? `/login?${params.toString()}` : '/login';
    return new NextResponse(null, {
        status: 307,
        headers: { Location: location }
    });
}
