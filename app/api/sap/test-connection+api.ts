export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, apiUrl } = body;

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

    // Test connection with a minimal request
    const sapResponse = await fetch(
      `${apiUrl}/A_SalesOrder?$top=1`,
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
      let errorMessage = `Connection failed: ${sapResponse.status} ${sapResponse.statusText}`;
      
      if (sapResponse.status === 401) {
        errorMessage = 'Authentication failed. Please check your credentials.';
      } else if (sapResponse.status === 403) {
        errorMessage = 'Access denied. You may not have permission to access this resource.';
      } else if (sapResponse.status === 404) {
        errorMessage = 'API endpoint not found. Please check the API URL.';
      }

      return new Response(
        JSON.stringify({ error: errorMessage, success: false }),
        {
          status: sapResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Connection successful' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Connection test error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Connection test failed',
        success: false 
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