'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import styles from './Toast.module.css';
import { useBrand } from '@/context/BrandContext';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ title, message, type = 'info', confirmText, cancelText, onConfirm, onCancel }) => {
    setToast({ title, message, type, confirmText, cancelText, onConfirm, onCancel });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const confirm = useCallback(({ title, message, confirmText = 'Yes', cancelText = 'Cancel', onConfirm }) => {
    setToast({ title, message, type: 'confirm', confirmText, cancelText, onConfirm, onCancel: () => setToast(null) });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, confirm }}>
      {children}
      {toast && <ToastModal toast={toast} onClose={hideToast} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

function ToastModal({ toast, onClose }) {
  const brand = useBrand();

  const handleConfirm = () => {
    if (toast.onConfirm) toast.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (toast.onCancel) toast.onCancel();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <img src={brand.logo} alt={brand.name} className={styles.logo} />
        </div>

        {/* Brand Name */}
        <p className={styles.brand}>{brand.name}</p>

        {/* Title */}
        {toast.title && <h2 className={styles.title}>{toast.title}</h2>}

        {/* Message */}
        {toast.message && <p className={styles.message}>{toast.message}</p>}

        {/* Buttons */}
        <div className={styles.buttons}>
          {toast.type === 'confirm' ? (
            <>
              <button onClick={handleCancel} className={styles.cancelBtn}>{toast.cancelText || 'Cancel'}</button>
              <button onClick={handleConfirm} className={styles.confirmBtn}>{toast.confirmText || 'Yes'}</button>
            </>
          ) : (
            <button onClick={onClose} className={styles.confirmBtn}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}
