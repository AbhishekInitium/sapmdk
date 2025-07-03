export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const top = url.searchParams.get('top') || '50';
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');
    const apiUrl = url.searchParams.get('apiUrl');

    if (!username || !password || !apiUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required credentials' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Basic Auth header
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

    // Make request to SAP API
    const sapResponse = await fetch(
      `${apiUrl}/A_SalesOrder`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!sapResponse.ok) {
      let errorMessage = `SAP API Error: ${sapResponse.status} ${sapResponse.statusText}`;
      
      if (sapResponse.status === 401) {
        errorMessage = 'Authentication failed. Please check your credentials.';
      } else if (sapResponse.status === 403) {
        errorMessage = 'Access denied. You may not have permission to access this resource.';
      } else if (sapResponse.status === 404) {
        errorMessage = 'API endpoint not found. Please check the API URL.';
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: sapResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await sapResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}