import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as auth from '../../utils/auth';

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsSubmitting(true);
    auth.register(formData.email, formData.password)
      .then((data) => {
        if (data) {
          setFormData({ email: '', password: '' });
          onRegister(true);
          navigate('/signin');
        }
      })
      .catch((err) => {
        console.error('Error al registrarse:', err);
        onRegister(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h2 className="auth__title">Regístrate</h2>
        <input
          className="auth__input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <input
          className="auth__input"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <button 
          className="auth__button" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Regístrate'}
        </button>
        <p className="auth__link">
          ¿Ya eres miembro? <Link to="/signin" className="auth__link-text">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}