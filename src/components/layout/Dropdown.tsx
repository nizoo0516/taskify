"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useOutsideClick } from "@/lib/useOutsideClick";

type DropdownProps = {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
};

export default function Dropdown({ isOpen, onClose, className, children }: DropdownProps) {
  const ref = useOutsideClick(() => {
    if (onClose) onClose();
  });

  return (
    <div ref={ref} className="relative z-10">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={cn(className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
