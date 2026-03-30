// Mock API - Works with Netlify, supports both solo and duo modes
// No backend needed - all data stored in memory/localStorage

// In-memory storage for sessions and photos (for duo mode)
// This persists within the same browser tab, but not across different users
const localSessions = new Map<string, any>();
const localPhotos = new Map<string, any>();

// Helper to generate room codes
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new photobooth session
export const createSession = async (cityVibe?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const roomCode = generateRoomCode();
  const sessionId = Math.random().toString(36).substring(7);
  
  const session = {
    id: sessionId,
    room_code: roomCode,
    city_vibe: cityVibe || 'melbourne',
    user_count: 1,
    created_at: new Date().toISOString()
  };
  
  // Store session for duo mode
  localSessions.set(roomCode, session);
  
  // Also store in localStorage for persistence
  const savedSessions = JSON.parse(localStorage.getItem('bunny_lola_sessions') || '[]');
  savedSessions.push(session);
  localStorage.setItem('bunny_lola_sessions', JSON.stringify(savedSessions));
  
  return {
    success: true,
    session,
    roomCode
  };
};

// Join an existing session (for duo mode)
export const joinSession = async (roomCode: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if session exists in memory
  let session = localSessions.get(roomCode.toUpperCase());
  
  // If not in memory, try localStorage
  if (!session) {
    const savedSessions = JSON.parse(localStorage.getItem('bunny_lola_sessions') || '[]');
    session = savedSessions.find((s: any) => s.room_code === roomCode.toUpperCase());
    
    if (session) {
      // Restore to memory
      localSessions.set(roomCode.toUpperCase(), session);
    }
  }
  
  if (!session) {
    return {
      success: false,
      error: 'Session not found'
    };
  }
  
  // Update user count
  session.user_count = 2;
  localSessions.set(roomCode.toUpperCase(), session);
  
  return {
    success: true,
    session
  };
};

// Get session details
export const getSession = async (roomCode: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let session = localSessions.get(roomCode);
  
  if (!session) {
    const savedSessions = JSON.parse(localStorage.getItem('bunny_lola_sessions') || '[]');
    session = savedSessions.find((s: any) => s.room_code === roomCode);
  }
  
  if (!session) {
    return {
      success: false,
      error: 'Session not found'
    };
  }
  
  return {
    success: true,
    session
  };
};

// Update city vibe for a session
export const updateCityVibe = async (roomCode: string, cityVibe: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let session = localSessions.get(roomCode);
  
  if (session) {
    session.city_vibe = cityVibe;
    localSessions.set(roomCode, session);
  }
  
  return {
    success: true,
    session
  };
};

// Upload a photo
export const uploadPhoto = async (sessionId: string, imageFile: File, position: number) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Create a local URL for the photo
  const imageUrl = URL.createObjectURL(imageFile);
  const photoId = Math.random().toString(36).substring(7);
  
  const photo = {
    id: photoId,
    session_id: sessionId,
    image_url: imageUrl,
    position: position,
    created_at: new Date().toISOString()
  };
  
  // Store photo
  const key = `${sessionId}_${position}`;
  localPhotos.set(key, photo);
  
  // Also store in localStorage
  const savedPhotos = JSON.parse(localStorage.getItem(`photos_${sessionId}`) || '[]');
  savedPhotos.push(photo);
  localStorage.setItem(`photos_${sessionId}`, JSON.stringify(savedPhotos));
  
  return {
    success: true,
    photo
  };
};

// Get all photos for a session
export const getSessionPhotos = async (sessionId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sessionPhotos: any[] = [];
  
  // Get from memory - using Array.from to fix iteration error
  const photosArray = Array.from(localPhotos.entries());
  for (const [key, photo] of photosArray) {
    if (photo.session_id === sessionId) {
      sessionPhotos.push(photo);
    }
  }
  
  // If empty, try localStorage
  if (sessionPhotos.length === 0) {
    const savedPhotos = JSON.parse(localStorage.getItem(`photos_${sessionId}`) || '[]');
    for (const photo of savedPhotos) {
      sessionPhotos.push(photo);
      // Restore to memory
      localPhotos.set(`${sessionId}_${photo.position}`, photo);
    }
  }
  
  sessionPhotos.sort((a, b) => a.position - b.position);
  
  return {
    success: true,
    photos: sessionPhotos
  };
};

// Generate PDF for printing
export const generatePDF = async (photos: string[], design: any, cityVibe: string, captions: string[]) => {
  // Create a simple HTML-based PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bunny & Lola Photostrip</title>
      <style>
        body {
          font-family: 'Cormorant Garamond', serif;
          margin: 0;
          padding: 40px;
          background: #FEFAF5;
        }
        .photostrip {
          max-width: 400px;
          margin: 0 auto;
          background: #f5e6d3;
          padding: 20px;
          border: 1px solid #E8DFD3;
        }
        .photo {
          margin-bottom: 20px;
        }
        .photo img {
          width: 100%;
          height: auto;
          filter: grayscale(100%) contrast(120%) brightness(90%) sepia(25%);
        }
        .caption {
          text-align: center;
          margin-top: 10px;
          font-style: italic;
          color: #8B7E6B;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8B7E6B;
        }
      </style>
    </head>
    <body>
      <div class="photostrip">
        ${photos.map((photo, idx) => `
          <div class="photo">
            <img src="${photo}" alt="Photo ${idx + 1}" />
            ${captions[idx] ? `<div class="caption">"${captions[idx]}"</div>` : ''}
          </div>
        `).join('')}
        <div class="footer">
          ${cityVibe.toUpperCase()} • VINTAGE EDITION<br/>
          Bunny & Lola Photobooth
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create a blob from HTML
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return blob;
};

// Helper to check if duo mode is active (if friend is connected)
export const checkFriendConnection = async (roomCode: string) => {
  const result = await getSession(roomCode);
  return {
    connected: result.success && result.session.user_count >= 2,
    userCount: result.success ? result.session.user_count : 0
  };
};

// Clear all data (for testing)
export const clearAllData = () => {
  localSessions.clear();
  localPhotos.clear();
  localStorage.removeItem('bunny_lola_sessions');
  
  // Clear all photo storage
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith('photos_')) {
      localStorage.removeItem(key);
    }
  }
};