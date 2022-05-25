<template>
  <div class="container">
    <div class="d-flex justify-content-center" style="min-height: 48px;">
      <h3>{{ snapStatus }}</h3>
    </div>
    <div class="row v">
      <div class="col-sm">
        <Card :image="previousCard ? previousCard.image : null" transition="fade" />
      </div>
      <div class="col-sm">
        <Card :image="currentCard ? currentCard.image : null" :transition="previousCard ? 'slide-left' : 'fade'" />
      </div>
    </div>
  </div>
  <div v-if="cardsRemaining !== 0" class="d-flex justify-content-center mt-3" data-test-id="remaining">
    <button
      :disabled="inProgress"
      class="btn btn-primary"
      @click="onDrawCard"
    >
      Draw Card
    </button>
  </div>
  <transition mode="out-in" name="fade">
    <div v-if="cardsRemaining === 0" class="mt-3">
      <div class="d-flex justify-content-center">
        <h3>VALUE MATCHES: {{ valueMatches }}</h3>
      </div>
      <div class="d-flex justify-content-center">
        <h3>SUIT MATCHES: {{ suitMatches }}</h3>
      </div>
    </div>
    <div v-else class="mt-1">
      <div class="d-flex justify-content-center">
        <h3>{{ cardsRemaining }} cards remaining</h3>
      </div>
      <div v-if="valueSnapProbability !== ''" class="d-flex justify-content-center">
        <h3>Value Snap Probability: {{ valueSnapProbability }}</h3>
      </div>
      <div v-if="valueSnapProbability !== ''" class="d-flex justify-content-center">
        <h3>Suit Snap Probability: {{ suitSnapProbability }}</h3>
      </div>
    </div>
  </transition>
</template>

<script>
import { drawCard, getCards } from "../tools/api";
import audio from "../tools/audio";
import Card from "./Card.vue";

export default {
  name: "Main-Component",
  components: {
    Card
  },
  beforeMount() {
    getCards().then((deck) => {
      // save deck id
      const deckId = deck.deck_id;
      // save deck size
      const cardsRemaining = deck.remaining;
      // save number of values and suits
      const suitsNumber = 4;
      const valuesNumber = Math.floor(deck.remaining / suitsNumber);

      this.deckId = deckId;
      this.cardsRemaining = cardsRemaining;
      this.valuesNumber = valuesNumber;
      this.suitsNumber = suitsNumber;
    });
  },

  data() {
    return {
      deckId: 0, cardsRemaining: 0, suitsNumber: 0, valuesNumber: 0,
      currentCard: null,
      previousCard: null,
      snapStatus: "",
      valueMatches: 0,
      suitMatches: 0,
      valuesDrawn: new Object(),
      suitsDrawn: new Object(),
      valueSnapProbability: "",
      suitSnapProbability: "",
      inProgress: false
    };
  },
  methods: {
    async onDrawCard() {
      if (this.inProgress) {
        return;
      }
      this.inProgress = true;

      // move current card to previous and set current card to null
      if (this.currentCard) {
        this.previousCard = this.currentCard;
      }
      this.currentCard = null;

      // draw a new card
      const drawCardResult = await drawCard(this.deckId);

      const { playAudioDraw, playAudioError, playAudioFinal } = await audio();
      if (drawCardResult) {
        this.currentCard = drawCardResult.card;
        this.cardsRemaining = drawCardResult.remaining;
        this.updateDrawnCards();
        this.updateSnapStatus();
        this.checkProbability();
        this.inProgress = false;
        if (this.cardsRemaining === 0) {
          playAudioFinal();
        } else {
          playAudioDraw();
        }
      } else {
        playAudioError();
        this.snapStatus = "API error";
      }
    },
    updateSnapStatus() {
      this.snapStatus = "";
      if (this.previousCard && this.currentCard) {
        // check value match
        if (this.previousCard.value === this.currentCard.value) {
          this.valueMatches += 1;
          this.snapStatus = "SNAP VALUE!";
        }
        // check suit match
        if (this.previousCard.suit === this.currentCard.suit) {
          this.suitMatches += 1;
          this.snapStatus = "SNAP SUIT!";
        }
      }
    },
    updateDrawnCards() {
      // increment number of drawn values and suits
      if (this.currentCard) {
        if (!this.valuesDrawn[this.currentCard.value]) {
          // this is the first value in deck
          this.valuesDrawn[this.currentCard.value] = 1;
        } else {
          this.valuesDrawn[this.currentCard.value] += 1;
        }
        if (!this.suitsDrawn[this.currentCard.suit]) {
          // this is the first suit in deck
          this.suitsDrawn[this.currentCard.suit] = 1;
        } else {
          this.suitsDrawn[this.currentCard.suit] += 1;
        }
      }
    },
    checkProbability() {
      if (this.currentCard) {
        const currentValuesDrawn = this.valuesDrawn[this.currentCard.value];
        const currentSuitsDrawn = this.suitsDrawn[this.currentCard.suit];
        this.valueSnapProbability = `${Math.round(100 * (this.suitsNumber - currentValuesDrawn) / this.cardsRemaining)}%`;
        this.suitSnapProbability = `${Math.round(100 * (this.valuesNumber - currentSuitsDrawn) / this.cardsRemaining)}%`;
      }
    }
  }
};
</script>