import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HOP_BY_HOP_HEADERS = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
]);

const FORWARDED_REQUEST_HEADERS = [
    'accept',
    'accept-language',
    'content-type',
    'authorization',
    'cookie',
    'origin',
    'referer',
    'range',
    'if-none-match',
    'if-modified-since',
    'user-agent',
];

function resolveUpstreamBase() {
    const candidates = [
        process.env.INTERNAL_REMARK42_URL,
        process.env.REMARK42_INTERNAL_URL,
        process.env.NEXT_PUBLIC_REMARK42_URL,
        'http://localhost:8080',
    ];
    const value = candidates.find(Boolean) || 'http://localhost:8080';
    return value.replace(/\/+$/, '');
}

function buildForwardHeaders(request: NextRequest) {
    const headers = new Headers();
    for (const name of FORWARDED_REQUEST_HEADERS) {
        const value = request.headers.get(name);
        if (value) {
            headers.set(name, value);
        }
    }
    headers.set('x-forwarded-host', request.headers.get('host') || '');
    headers.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''));
    return headers;
}

function normalizeResponseHeaders(source: Headers) {
    const headers = new Headers();
    source.forEach((value, key) => {
        if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
            headers.set(key, value);
        }
    });
    headers.set('x-remark42-proxy', '1');
    return headers;
}

async function handleProxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path = [] } = await context.params;
    const upstreamBase = resolveUpstreamBase();
    const upstreamUrl = new URL(`${upstreamBase}/${path.join('/')}`);
    upstreamUrl.search = request.nextUrl.search;
    const normalizedPath = `/${path.join('/')}`;
    const isUserProbe = normalizedPath === '/api/v1/user';

    try {
        const body = request.method === 'GET' || request.method === 'HEAD'
            ? undefined
            : await request.arrayBuffer();

        const upstreamResponse = await fetch(upstreamUrl.toString(), {
            method: request.method,
            headers: buildForwardHeaders(request),
            body,
            redirect: 'manual',
            cache: 'no-store',
        });

        // Remark42 polls this endpoint to detect auth state.
        // Convert anonymous 401 to guest success response to avoid browser console noise.
        if (isUserProbe && upstreamResponse.status === 401) {
            return new NextResponse('null', {
                status: 200,
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'cache-control': 'no-store',
                    'x-remark42-auth-state': 'guest',
                    'x-remark42-proxy': '1',
                },
            });
        }

        const status = upstreamResponse.status;
        const headers = normalizeResponseHeaders(upstreamResponse.headers);
        if (status === 204 || status === 205 || status === 304) {
            return new NextResponse(null, {
                status,
                headers,
            });
        }

        const responseBody = await upstreamResponse.arrayBuffer();
        return new NextResponse(responseBody, {
            status,
            headers,
        });
    } catch (error) {
        console.error('Remark42 proxy error:', error);
        return NextResponse.json(
            { message: 'Remark42 proxy unavailable' },
            { status: 502 }
        );
    }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, context);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, context);
}
