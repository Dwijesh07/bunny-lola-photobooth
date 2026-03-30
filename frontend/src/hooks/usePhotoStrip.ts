import { useState } from 'react';

export const usePhotoStrip = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [design, setDesign] = useState({
    template: 'classic',
    stickers: [],
    captions: []
  });

  const addPhoto = (photo: string) => {
    setPhotos(prev => [...prev, photo]);
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  return {
    photos,
    design,
    setDesign,
    addPhoto,
    clearPhotos
  };
};