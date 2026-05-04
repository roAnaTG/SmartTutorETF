import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = true, padding = 'p-8' }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5 } : {}}
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all ${padding} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
