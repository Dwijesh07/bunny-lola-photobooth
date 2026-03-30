import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';
import { generatePDF } from '../utils/api';

interface PrintSession {
  id: string;
  photos: string[];
  design: any;
  cityVibe: any;
  captions: string[];
}

const Print: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<PrintSession | null>(null);
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`session_${sessionId}`);
    if (saved) {
      setSession(JSON.parse(saved));
    }
  }, [sessionId]);

  const handlePrint = async () => {
    if (!session) return;
    
    setIsPrinting(true);
    try {
      const pdfBlob = await generatePDF(
        session.photos,
        session.design,
        session.cityVibe?.name || 'melbourne',
        session.captions
      );
      
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      toast.success('PDF generated! Ready to print 🖨️');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsPrinting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Session not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-retro"
        >
          <h1 className="text-3xl font-vintage text-bunny-pink text-center mb-6">
            🖨️ Print Your Photostrip
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Preview</h3>
              <div className="bg-white rounded-lg p-4 shadow">
                {session.photos.map((photo, idx) => (
                  <div key={idx} className="mb-4">
                    <img src={photo} alt={`Photo ${idx + 1}`} className="w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Print Settings</h3>
              
              <div className="mb-6">
                <label className="block mb-2">Number of copies:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => setCopies(num)}
                      className={`w-12 h-12 rounded-full ${
                        copies === num
                          ? 'bg-bunny-pink text-white'
                          : 'bg-gray-200 hover:bg-lola-pink'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button onClick={handlePrint} disabled={isPrinting} className="w-full">
                  {isPrinting ? '🖨️ Generating PDF...' : '🖨️ Download & Print'}
                </Button>
                <Button onClick={() => navigate('/gallery')} variant="outline" className="w-full">
                  ← Back to Gallery
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Print;