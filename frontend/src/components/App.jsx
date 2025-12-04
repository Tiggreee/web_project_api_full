import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Header from './Header/Header'
import Main from './Main/Main'
import Footer from './Footer/Footer'
import Login from './Login/Login'
import Register from './Register/Register'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import InfoTooltip from './InfoTooltip/InfoTooltip'
import Popup from './Main/components/Popup/Popup'
import NewCard from './Main/components/form/NewCard/NewCard'
import EditProfile from './Main/components/form/EditProfile/EditProfile'
import EditAvatar from './Main/components/form/EditAvatar/EditAvatar'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import api from '../utils/api'
import * as auth from '../utils/auth'

function App() {
  const [popup, setPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tooltipInfo, setTooltipInfo] = useState({ isOpen: false, isSuccess: false, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token)
        .then((user) => {
          setLoggedIn(true);
          setUserEmail(user.email);
          navigate('/');
        })
        .catch(() => {
          localStorage.removeItem('jwt');
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          const cardsWithLikes = cardsData.map(card => ({
            ...card,
            isLiked: card.likes.some(id => id === userData._id)
          }));
          setCards(cardsWithLikes);
        })
        .catch((err) => {
          console.error('Error al cargar los datos:', err);
        });
    }
  }, [loggedIn]);

  const handleUpdateUser = (data) => {
    api.updateUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateAvatar = (data) => {
    api.updateAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleCardLike = async (card) => {
    const isLiked = card.isLiked;
    
    await api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((currentCard) => 
          currentCard._id === card._id 
            ? { ...newCard, isLiked: newCard.likes.some(id => id === currentUser._id) }
            : currentCard
        ));
      })
      .catch((error) => console.error(error));
  };

  const handleCardDelete = async (card) => {
    await api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((currentCard) => currentCard._id !== card._id));
      })
      .catch((error) => console.error(error));
  };

  const handleAddPlaceSubmit = (cardData) => {
    api.addCard(cardData)
      .then((newCard) => {
        const cardWithLike = {
          ...newCard,
          isLiked: newCard.likes.some(id => id === currentUser._id)
        };
        setCards([cardWithLike, ...cards]);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleOpenPopup = (popupType) => {
    let popupData;
    switch(popupType) {
      case 'newCard':
        popupData = { title: "Nuevo lugar", children: <NewCard /> };
        break;
      case 'editProfile':
        popupData = { title: "Editar perfil", children: <EditProfile /> };
        break;
      case 'editAvatar':
        popupData = { title: "Cambiar foto de perfil", children: <EditAvatar /> };
        break;
      default:
        popupData = null;
    }
    setPopup(popupData);
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  const handleLogin = (isSuccess, message) => {
    if (isSuccess) {
      setLoggedIn(true);
    } else {
      setTooltipInfo({
        isOpen: true,
        isSuccess: false,
        message: message || 'Uy, algo salió mal. Por favor, inténtalo de nuevo.'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setCurrentUser({});
    setCards([]);
    setUserEmail('');
    navigate('/signin');
  };

  const handleRegister = (isSuccess) => {
    setTooltipInfo({
      isOpen: true,
      isSuccess,
      message: isSuccess 
        ? '¡Correcto! Ya estás registrado.' 
        : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.'
    });
  };

  const closeTooltip = () => {
    setTooltipInfo({ isOpen: false, isSuccess: false, message: '' });
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, handleUpdateUser, handleUpdateAvatar, handleAddPlaceSubmit }}>
      <div className="page__content">
        <Header 
          loggedIn={loggedIn}
          userEmail={userEmail}
          onLogout={handleLogout}
          onEditProfile={() => handleOpenPopup('editProfile')}
          onAddPlace={() => handleOpenPopup('newCard')}
          onEditAvatar={() => handleOpenPopup('editAvatar')}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main 
                  cards={cards}
                  onImagePopup={setPopup}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signin" 
            element={loggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={loggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleRegister} />} 
          />
        </Routes>

        <Footer />
        
        {popup && (
          <Popup onClose={handleClosePopup} title={popup.title}>
            {popup.children}
          </Popup>
        )}

        <InfoTooltip 
          isOpen={tooltipInfo.isOpen}
          isSuccess={tooltipInfo.isSuccess}
          message={tooltipInfo.message}
          onClose={closeTooltip}
        />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
