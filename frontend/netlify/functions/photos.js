const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    // UPLOAD PHOTO - POST /api/photos/upload
    if (event.httpMethod === 'POST') {
      const { sessionId, imageData, position } = JSON.parse(event.body);
      
      // Convert base64 to buffer
      const base64Data = imageData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${sessionId}_${position}_${Date.now()}.jpg`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, buffer, { contentType: 'image/jpeg' });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      
      // Save to database
      const { data: photo, error: dbError } = await supabase
        .from('photos')
        .insert([{ session_id: sessionId, image_url: publicUrl, position }])
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, photo })
      };
    }
    
    // GET SESSION PHOTOS - GET /api/photos/session/:sessionId
    if (event.httpMethod === 'GET') {
      const sessionId = event.path.replace('/.netlify/functions/photos/session/', '');
      
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('session_id', sessionId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, photos: data })
      };
    }
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};