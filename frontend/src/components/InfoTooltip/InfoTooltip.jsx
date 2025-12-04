export default function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  if (!isOpen) return null;

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup__content popup__content_type_tooltip" onClick={(e) => e.stopPropagation()}>
        <button className="popup__close" onClick={onClose}>
          <img src="/src/images/close_button.png" alt="Cerrar" />
        </button>
        <div className={`tooltip__icon ${isSuccess ? 'tooltip__icon_success' : 'tooltip__icon_error'}`}></div>
        <p className="tooltip__message">
          {message || (isSuccess 
            ? '¡Correcto! Ya estás registrado.' 
            : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.'
          )}
        </p>
      </div>
    </div>
  );
}