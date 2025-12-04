export default function ImagePopup({ card: { name, link } }) {
  return (
    <>
      <img src={link} alt={name} className="popup__image" />
      <p className="popup__caption">{name}</p>
    </>
  );
}