"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  open: boolean;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  isOpenModal?: (open: boolean) => void;
  className?: string;
};

function Modal({ open, children, size = "lg", isOpenModal, className }: ModalProps) {
  const [portal, setPortal] = useState<Element | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortal(document.getElementById("portal"));
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  // 모달 사이즈
  const sizeClass =
    (
      {
        sm: "min-w-[368px] max-w-sm p-6",
        md: cn("w-[327px] px-4 py-6", "tablet:w-[568px] tablet:p-8"),
        lg: cn("w-[327px] px-4 py-6", "tablet:w-[584px] tablet:p-8"),
        xl: cn(
          "w-[327px] p-4",
          "tablet:w-[678px] tablet:py-6 tablet:px-8",
          "pc:w-[730px] pc:pt-[30px] pc:pr-[38px] pc:pb-[30px] pc:pl-4",
        ),
      } as const
    )[size] ?? "min-w-[584px] max-w-lg";

  if (!portal) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeIn" }}
          className="fixed top-0 left-0 z-50 h-screen w-screen overflow-hidden bg-black/40"
          onClick={() => isOpenModal?.(false)}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white",
              sizeClass,
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portal,
  );
}

type ModalHeaderProps = {
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  titleStyle?: string;
  extraBtn?: React.ReactNode;
  btnStyle?: string;
};
function ModalHeader({
  title,
  children,
  onClose,
  className,
  titleStyle,
  btnStyle,
  extraBtn,
}: ModalHeaderProps) {
  return (
    <div className={cn("mb-3 flex justify-between", className)}>
      <h3 className={cn("text-2xl font-bold", titleStyle)}>{title}</h3>
      {children}
      <div className={cn("flex items-center", btnStyle)}>
        {extraBtn}
        {onClose && (
          <button onClick={onClose} className="tablet:size-8 size-6">
            <Image
              src="/icons/icon-close-big.svg"
              alt="close"
              width={24}
              height={24}
              className="tablet:size-8"
            />
          </button>
        )}
      </div>
    </div>
  );
}

type ModalContextProps = {
  children: React.ReactNode;
  className?: string;
};

function ModalContext({ children, className }: ModalContextProps) {
  return (
    <div
      className={cn(
        "py-3",
        "tablet:max-h-[570px] tablet:overflow-x-hidden [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ModalFooterProps = {
  children?: React.ReactNode;
};

function ModalFooter({ children }: ModalFooterProps) {
  return <div className="flex gap-2 pt-3">{children}</div>;
}

export { Modal, ModalHeader, ModalContext, ModalFooter };
