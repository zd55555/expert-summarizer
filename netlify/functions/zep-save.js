// netlify/functions/zep-save.js
exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { memories } = JSON.parse(event.body);
    
    if (!memories || !Array.isArray(memories)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid memories format' })
      };
    }

    // Get Zep API key from environment variable
    const ZEP_API_KEY = process.env.ZEP_API_KEY;
    const ZEP_API_URL = process.env.ZEP_API_URL || 'https://api.getzep.com'; // Default to Zep Cloud
    
    if (!ZEP_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Zep API key not configured' })
      };
    }

    // TODO: Replace with actual Zep API calls
    // For now, we'll simulate the response
    // You'll need to replace this with real Zep API integration
    
    console.log('Saving memories to Zep:', memories);
    
    /*
    // REAL ZEP API CALL - Uncomment and modify when ready:
    
    const savePromises = memories.map(async (memory) => {
      const zepResponse = await fetch(`${ZEP_API_URL}/v1/memories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ZEP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: memory,
          user_id: 'default_user', // You might want to make this configurable
          timestamp: new Date().toISOString()
        })
      });

      if (!zepResponse.ok) {
        throw new Error(`Zep API error: ${zepResponse.status}`);
      }

      return await zepResponse.json();
    });

    const results = await Promise.all(savePromises);
    */

    // Simulated success response
    const results = memories.map((memory, index) => ({
      id: `mem_${Date.now()}_${index}`,
      content: memory,
      saved: true
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        results,
        success: true,
        saved_count: memories.length
      })
    };

  } catch (error) {
    console.error('Zep save error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save memories',
        details: error.message 
      })
    };
  }
};
