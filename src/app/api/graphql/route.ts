import { NextRequest, NextResponse } from 'next/server';

// Use server-side environment variable (not NEXT_PUBLIC_*) for API routes
// In Docker, use host.docker.internal to reach services on the host
const GRAPHQL_URL = process.env.ROUTE_SERVICE_URL || 
                    process.env.NEXT_PUBLIC_ROUTE_SERVICE_URL || 
                    (process.env.NODE_ENV === 'production' ? 'http://host.docker.internal:4000' : 'http://localhost:4000');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log for debugging
    console.log('[GraphQL Proxy] Forwarding request to:', `${GRAPHQL_URL}/graphql`);
    console.log('[GraphQL Proxy] Request body:', JSON.stringify(body).substring(0, 200));
    
    const response = await fetch(`${GRAPHQL_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[GraphQL Proxy] Response status:', response.status);
    console.log('[GraphQL Proxy] Response data:', JSON.stringify(data).substring(0, 200));
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error('[GraphQL Proxy] Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: error.stack,
        graphqlUrl: GRAPHQL_URL
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

