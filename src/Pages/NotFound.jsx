import { Link } from "react-router";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const textVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.4, ease: "easeOut" }
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

const NotFound = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--table-bg)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Optional SVG for visual appeal */}
      <motion.svg
        className="w-32 h-32 mb-6"
        fill="none"
        stroke="var(--text-secondary)"
        viewBox="0 0 24 24"
        variants={textVariants}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </motion.svg>

      <motion.h1
        className="text-6xl font-bold"
        style={{ color: 'var(--btn-primary)' }}
        variants={textVariants}
      >
        404
      </motion.h1>
      <motion.p
        className="mt-4 text-xl"
        style={{ color: 'var(--text-secondary)' }}
        variants={textVariants}
      >
        Oops! Page not found.
      </motion.p>
      <motion.p
        className="mt-2 text-base"
        style={{ color: 'var(--text-tertiary)' }}
        variants={textVariants}
      >
        The page you're looking for doesn’t exist.
      </motion.p>
      <motion.div
        variants={buttonVariants}
        whileHover="hover"
      >
        <Link
          to="/"
          className="mt-6 px-5 py-2 rounded-lg font-semibold transition"
          style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--text-primary)' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--btn-primary-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--btn-primary)')}
        >
          Go Back Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;