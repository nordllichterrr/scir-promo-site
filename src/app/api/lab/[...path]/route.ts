import { NextRequest } from 'next/server';


type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(
  request: NextRequest,
  context: RouteContext,
) {
  const backend = process.env.DJANGO_API_URL?.replace(/\/+$/, '');

  if (!backend) {
    return Response.json(
      { detail: 'Django API is not configured.' },
      { status: 503 },
    );
  }

  const { path } = await context.params;

  if (!path || path.length === 0) {
    return Response.json(
      { detail: 'API path is required.' },
      { status: 400 },
    );
  }

  if (
    path.some(
      (segment) =>
        !segment ||
        segment === '.' ||
        segment === '..' ||
        segment.includes('/') ||
        segment.includes('\\\\'),
    )
  ) {
    return Response.json(
      { detail: 'Invalid API path.' },
      { status: 400 },
    );
  }

  const encodedPath = path.map(encodeURIComponent).join('/');

  const headers = new Headers();

  const forwardedHeaders = [
    'accept',
    'content-type',
    'cookie',
    'x-csrftoken',
    'origin',
    'referer',
    'user-agent',
  ];

  for (const name of forwardedHeaders) {
    const value = request.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  }

  try {
    const backendUrl = new URL(backend);

    if (
      !['http:', 'https:'].includes(backendUrl.protocol) ||
      backendUrl.username ||
      backendUrl.password ||
      backendUrl.pathname !== '/' ||
      backendUrl.search ||
      backendUrl.hash
    ) {
      throw new Error('Invalid Django API URL configuration.');
    }

    const target = new URL(
      `/api/lab/v1/${encodedPath}/${request.nextUrl.search}`,
      backendUrl.origin,
    );

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method)
        ? undefined
        : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    });

    const responseHeaders = new Headers();

    const contentType = upstream.headers.get('content-type');
    const contentDisposition = upstream.headers.get('content-disposition');

    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    if (contentDisposition) {
      responseHeaders.set('content-disposition', contentDisposition);
    }


    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'referrer-policy',
      'cross-origin-opener-policy',
    ];

    for (const name of securityHeaders) {
      const value = upstream.headers.get(name);
      if (value) {
        responseHeaders.set(name, value);
      }
    }

    responseHeaders.set('cache-control', 'no-store');

    // Preserve every Set-Cookie header separately.
    const getSetCookie = (
      upstream.headers as Headers & {
        getSetCookie?: () => string[];
      }
    ).getSetCookie;

    const cookies = getSetCookie
      ? getSetCookie.call(upstream.headers)
      : [];

    for (const cookie of cookies) {
      responseHeaders.append('set-cookie', cookie);
    }

    // Compatibility fallback for runtimes without getSetCookie().
    if (!getSetCookie) {
      const cookie = upstream.headers.get('set-cookie');

      if (cookie) {
        responseHeaders.append('set-cookie', cookie);
      }
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { detail: 'Unable to reach Django API.' },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
