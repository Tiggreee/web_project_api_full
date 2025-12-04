import { useRef, useContext } from 'react';
import { CurrentUserContext } from '../../../../../contexts/CurrentUserContext';

export default function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const avatarRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    handleUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit} noValidate>
      <label className="popup__field">
        <input 
          className="popup__input" 
          type="url" 
          placeholder="Enlace del avatar" 
          required 
          ref={avatarRef}
        />
        <span className="popup__error"></span>
      </label>
      <button className="button popup__button" type="submit">Guardar</button>
    </form>
  );
}