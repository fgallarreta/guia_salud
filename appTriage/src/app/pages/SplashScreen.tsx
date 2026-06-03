import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logoImg from '../../imports/logo.jpeg';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a5c] via-[#1e4466] to-[#224e70] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative inline-block mb-8"
        >
          <ImageWithFallback
            src={logoImg}
            alt="Guía Salud Logo"
            className="w-48 h-48 object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-blue-100 text-lg"
        >
          Tu asistente de salud personal
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <div className="flex gap-1 justify-center">
            {[0, 0.1, 0.2].map((delay, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-5, 5, -5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-white rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
