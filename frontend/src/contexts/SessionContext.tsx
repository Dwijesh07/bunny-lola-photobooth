import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Session, Design, CityVibe } from '../types';

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  design: Design;
  setDesign: (design: Design) => void;
  cityVibe: CityVibe | null;
  setCityVibe: (city: CityVibe | null) => void;
  roomCode: string;
  setRoomCode: (code: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [design, setDesign] = useState<Design>({
    template: 'classic',
    fontStyle: 'retro',
    filter: 'none',
    stickers: [],
    captions: []
  });
  const [cityVibe, setCityVibe] = useState<CityVibe | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');

  return (
    <SessionContext.Provider value={{
      session,
      setSession,
      design,
      setDesign,
      cityVibe,
      setCityVibe,
      roomCode,
      setRoomCode
    }}>
      {children}
    </SessionContext.Provider>
  );
};