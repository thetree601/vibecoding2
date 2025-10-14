'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  content: ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  const value = {
    isOpen,
    openModal,
    closeModal,
    content,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalPortal isOpen={isOpen} onClose={closeModal}>
        {content}
      </ModalPortal>
    </ModalContext.Provider>
  );
};

interface ModalPortalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
