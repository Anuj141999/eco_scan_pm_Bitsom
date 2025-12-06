import { motion, type Easing } from "framer-motion";

interface LeafIconProps {
  className?: string;
  animate?: boolean;
}

export const LeafIcon = ({ className = "w-8 h-8", animate = false }: LeafIconProps) => {
  const easeValue: Easing = "easeInOut";
  
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: easeValue }
    }
  };

  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
    >
      <motion.path
        d="M12 3C16.5 3 20 6.5 20 11C20 15.5 16.5 19 12 19C7.5 19 4 15.5 4 11C4 6.5 7.5 3 12 3Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <motion.path
        d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={animate ? pathVariants : undefined}
      />
      <motion.path
        d="M12 21C12 21 16 17 16 12C16 7 12 3 12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={animate ? pathVariants : undefined}
      />
      <motion.path
        d="M12 3V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={animate ? pathVariants : undefined}
      />
    </motion.svg>
  );
};
