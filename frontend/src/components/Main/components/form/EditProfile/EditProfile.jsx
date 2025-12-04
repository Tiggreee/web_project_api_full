import { useState, useEffect, useContext } from 'react';
import { CurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { validateField } from '../../../../../utils/formValidation';

export default function EditProfile() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;
  
  const [name, setName] = useState(currentUser.name || "");
  const [description, setDescription] = useState(currentUser.about || "");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    setName(currentUser.name || "");
    setDescription(currentUser.about || "");
  }, [currentUser]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateField(value, 2, 40));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setDescriptionError(validateField(value, 2, 200));
  };

  useEffect(() => {
    setIsFormValid(!nameError && !descriptionError && name.trim() && description.trim());
  }, [nameError, descriptionError, name, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      handleUpdateUser({ name, about: description });
    }
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit} noValidate>
      <label className="popup__field">
        <input
          className={`popup__input ${nameError ? 'popup__input_type_error' : ''}`}
          value={name}
          onChange={handleNameChange}
          placeholder="Nombre"
          maxLength="40"
          minLength="2"
          required
        />
        <span className={`popup__error ${nameError ? 'popup__error_visible' : ''}`}>{nameError}</span>
      </label>
      <label className="popup__field">
        <input
          className={`popup__input ${descriptionError ? 'popup__input_type_error' : ''}`}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Acerca de mí"
          maxLength="200"
          minLength="2"
          required
        />
        <span className={`popup__error ${descriptionError ? 'popup__error_visible' : ''}`}>{descriptionError}</span>
      </label>
      <button className={`button popup__button ${!isFormValid ? 'popup__button_disabled' : ''}`} disabled={!isFormValid}>
        Guardar
      </button>
    </form>
  );
}