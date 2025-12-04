import { useEffect } from 'react';

export default function Popup({ onClose, title, children }) {
  useEffect(() => {
    const handleEscClose = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscClose);
    return () => document.removeEventListener('keydown', handleEscClose);
  }, [onClose]);

  const handleOverlayClick = (e) => e.target === e.currentTarget && onClose();

  return (
    <div className={`popup popup_opened ${!title ? 'popup_type_image' : ''}`} onClick={handleOverlayClick}>
      <div className="popup__content">
        <button className="popup__close" onClick={onClose} aria-label="Cerrar"></button>
        {title && <h3 className="popup__title">{title}</h3>}
        {children}
      </div>
    </div>
  );
}