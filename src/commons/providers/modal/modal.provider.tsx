"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  content: ReactNode;
  modalStack: ReactNode[];
  addToStack: (modal: ReactNode) => void;
  removeFromStack: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [modalStack, setModalStack] = useState<ReactNode[]>([]);

  // body 스크롤 제거/복원 로직
  useEffect(() => {
    const hasAnyModalOpen = isOpen || modalStack.length > 0;

    if (hasAnyModalOpen) {
      // 모달이 하나라도 열려있으면 body 스크롤 제거
      document.body.style.overflow = "hidden";
    } else {
      // 모든 모달이 닫히면 body 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, modalStack.length]);

  const openModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  const addToStack = useCallback((modal: ReactNode) => {
    setModalStack((prev) => [...prev, modal]);
  }, []);

  const removeFromStack = useCallback(() => {
    setModalStack((prev) => prev.slice(0, -1));
  }, []);

  const value = {
    isOpen,
    openModal,
    closeModal,
    content,
    modalStack,
    addToStack,
    removeFromStack,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalPortal isOpen={isOpen} onClose={closeModal}>
        {content}
      </ModalPortal>
      {/* 중첩 모달들을 렌더링 */}
      {modalStack.map((modal, index) => (
        <ModalPortal
          key={index}
          isOpen={true}
          onClose={() => {}}
          zIndex={50 + index + 1} // 각 중첩 모달마다 z-index 증가
        >
          {modal}
        </ModalPortal>
      ))}
    </ModalContext.Provider>
  );
};

interface ModalPortalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
}

const ModalPortal: React.FC<ModalPortalProps> = ({
  children,
  isOpen,
  onClose,
  zIndex = 50,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex }}
      onClick={handleBackdropClick}
    >
      {children}
    </div>,
    modalRoot
  );
};
