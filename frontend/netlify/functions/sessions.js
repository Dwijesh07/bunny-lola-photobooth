const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const path = event.path.replace('/.netlify/functions/sessions', '');
    
    // CREATE SESSION - POST /api/sessions/create
    if (event.httpMethod === 'POST' && path === '/create') {
      const { cityVibe = 'melbourne' } = JSON.parse(event.body);
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ room_code: roomCode, city_vibe: cityVibe, user_count: 1 }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, session: data, roomCode })
      };
    }
    
    // JOIN SESSION - POST /api/sessions/join
    if (event.httpMethod === 'POST' && path === '/join') {
      const { roomCode } = JSON.parse(event.body);
      
      const { data: session, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('room_code', roomCode)
        .single();
      
      if (error || !session) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Session not found' })
        };
      }
      
      // Increment user count
      await supabase.rpc('increment_user_count', { session_room_code: roomCode });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, session })
      };
    }
    
    // GET SESSION - GET /api/sessions/:roomCode
    if (event.httpMethod === 'GET' && path !== '') {
      const roomCode = path.replace('/', '');
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('room_code', roomCode)
        .single();
      
      if (error) throw error;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, session: data })
      };
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};