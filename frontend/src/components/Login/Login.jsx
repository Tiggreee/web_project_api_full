import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as auth from '../../utils/auth';

export default function Login({ onLogin }) {
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
    auth.authorize(formData.email, formData.password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setFormData({ email: '', password: '' });
          onLogin(true);
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('Error al iniciar sesión:', err);
        onLogin(false, 'Usuario o contraseña incorrectos');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h2 className="auth__title">Inicia sesión</h2>
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
          autoComplete="current-password"
          required
        />
        <button 
          className="auth__button" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Inicia sesión'}
        </button>
        <p className="auth__link">
          ¿Aún no eres miembro? <Link to="/signup" className="auth__link-text">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}