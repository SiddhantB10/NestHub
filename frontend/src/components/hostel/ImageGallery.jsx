import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGallery({ images, name }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const next = () => setCurrent(i => (i + 1) % images.length);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 rounded-2xl overflow-hidden">
        <div
          className="md:col-span-2 md:row-span-2 relative cursor-pointer group"
          onClick={() => { setCurrent(0); setLightboxOpen(true); }}
        >
          <img
            src={images[0]}
            alt={`${name} - Main`}
            className="w-full h-64 md:h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="hidden md:block relative cursor-pointer group"
            onClick={() => { setCurrent(i + 1); setLightboxOpen(true); }}
          >
            <img
              src={img}
              alt={`${name} - ${i + 2}`}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              style={{ minHeight: '140px' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{images.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex md:hidden gap-2 mt-2 overflow-x-auto pb-2">
        {images.slice(1).map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${name} - ${i + 2}`}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 cursor-pointer"
            onClick={() => { setCurrent(i + 1); setLightboxOpen(true); }}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <motion.img
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={images[current]}
              alt={`${name} - ${current + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />

            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-white w-6' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
