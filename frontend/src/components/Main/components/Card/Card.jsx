import { useContext } from 'react';
import trashIcon from '../../../../images/trashbin.png';
import { CurrentUserContext } from '../../../../contexts/CurrentUserContext';

export default function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);
  const { name, link, isLiked, owner } = card;
  
  const isOwn = owner === currentUser._id;
  const cardLikeButtonClassName = `grid__like ${isLiked ? 'grid__like_active' : ''}`;
  
  const handleLikeClick = () => {
    onCardLike?.(card);
  };
  
  const handleDeleteClick = () => {
    onCardDelete?.(card);
  };
  
  return (
    <li className="grid__item">
      {isOwn && (
        <button className="grid__delete" onClick={handleDeleteClick}>
          <img src={trashIcon} alt="Eliminar" className="grid__delete-icon" />
        </button>
      )}
      <img className="grid__pic" src={link} alt={name} onClick={() => onCardClick?.(card)} />
      <div className="grid__item-row">
        <h2 className="grid__title">{name}</h2>
        <button className={cardLikeButtonClassName} onClick={handleLikeClick}>
          <div className="grid__like-heart"></div>
        </button>
      </div>
    </li>
  );
}