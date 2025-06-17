import { motion } from 'framer-motion';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Spinner;
