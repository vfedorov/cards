import Axios from "axios";

const URL_SHUFFLE_DECKS = "https://deckofcardsapi.com/api/deck/new/shuffle/";
const URL_DRAW_CARD = "https://deckofcardsapi.com/api/deck/";

export const getCards = () =>
  Axios.get(`${URL_SHUFFLE_DECKS}?deck_count=1`).then((res) => res.data);

export const drawCard = (deckId) =>
  Axios.get(`${URL_DRAW_CARD}${deckId}/draw/?count=1`).then((response) => {
    if (response.data.cards && response.data.cards.length > 0) {
      return {
        card: response.data.cards[0],
        remaining: response.data.remaining,
      };
    }
    return null;
  });
