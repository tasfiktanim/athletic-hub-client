import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/banner1.jpg", 
    heading: "Push Your Limits",
    sub: "Join top-tier athletic events near you.",
  },
  {
    id: 2,
    image: "/banner2.jpg",
    heading: "Find Your Next Challenge",
    sub: "Compete, connect, and grow stronger.",
  },
  {
    id: 3,
    image: "/banner3.jpg",
    heading: "Be Unstoppable",
    sub: "Dominate the field with AthleticHub.",
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-lg shadow-lg mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].heading}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              console.error("Image failed to load:", slides[currentSlide].image);
            }}
          />
          <div className="absolute inset-0  bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-2"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {slides[currentSlide].heading}
            </motion.h2>
            <motion.p
              className="text-lg md:text-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {slides[currentSlide].sub}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Banner;
