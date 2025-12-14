class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _getHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
    });
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
    });
  }

  updateUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({ name, about }),
    });
  }

  addCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    });
  }

  likeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._getHeaders(),
    });
  }

  unlikeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.likeCard(cardId) : this.unlikeCard(cardId);
  }

  updateAvatar({ avatar }) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar }),
    });
  }
}

const api = new Api({
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://tigre-around.duckdns.org/api'
    : 'http://localhost:3000',
});

export default api;
