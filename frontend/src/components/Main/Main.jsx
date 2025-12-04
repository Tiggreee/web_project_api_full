import Card from './components/Card/Card'
import ImagePopup from './components/ImagePopup/ImagePopup'
import Popup from './components/Popup/Popup'
import { CurrentUserContext } from '../../contexts/CurrentUserContext'

function Main({ cards, onImagePopup, onCardLike, onCardDelete }) {
  const handleCardClick = (card) => onImagePopup({ title: null, children: <ImagePopup card={card} /> });

  return (
    <main className="grid">
      <ul className="cards__list">
        {cards.map((card) => (
          <Card 
            key={card._id} 
            card={card} 
            onCardClick={handleCardClick} 
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>
      {false && <Popup />}
    </main>
  );
}

export default Main