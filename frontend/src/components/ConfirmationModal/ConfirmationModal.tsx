import type { ReactNode } from 'react';
import './ConfirmationModal.css';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'info' | 'warning' | 'danger' | 'success';
  confirmDisabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  confirmDisabled = false,
  loading = false,
  children
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!confirmDisabled && !loading) {
      onConfirm();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal">
        <div className={`confirmation-modal-header variant-${variant}`}>
          <h2 className="confirmation-modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="confirmation-modal-close"
            aria-label="Close modal"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="confirmation-modal-body">
          <div className="confirmation-modal-message">{message}</div>
          {children && <div className="confirmation-modal-content">{children}</div>}
        </div>

        <div className="confirmation-modal-footer">
          <button
            onClick={onClose}
            className="btn-modal-cancel"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`btn-modal-confirm variant-${variant}`}
            disabled={confirmDisabled || loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
