// 1. imports
import axios from 'axios'
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import cardData from '../../../seed/js/dynamic-seed'

// 2. action definitions
import {
  INIT_DECK, INIT_SECTION_CARD, INIT_JS_DECK, INIT_QUIZ_DECK,
  SELECT_DECK, SELECT_CARD, FLIP_CARD, FORWARD_BACKWARD_CARD,
  FORWARD_BACKWARD_DECK, START_DECK_CYCLE, STOP_DECK_CYCLE
} from './actions'

// 3. initial state
const initialState = {
  title: '',
  sections: [],
  activeSectionIndex: 0,
  activeCardIndex: 0,
  sectionUrl: null,
  cardUrl: null,
  currentCard: {
    side: ''
  },
}

// 4. reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_JS_DECK: {
      const jsDeck = {
        title: 'js',
        sections: cardData
      }
      const { title, cardId, side, sectionId } = action.payload
      const curr = cardData[state.activeSectionIndex]
      const activeSectionIndex = jsDeck.sections.findIndex(x => x.id == sectionId)
      const newSectionIndex = activeSectionIndex === -1 ? 0 : activeSectionIndex
      const currCards = jsDeck.sections[newSectionIndex].cards
      const activeCardIndex = currCards.findIndex(x => x.id == cardId)
      const newCardIndex = activeCardIndex === -1 ? 0 : activeCardIndex
      const newCard = {...currCards[newCardIndex], side: 'front'}
      return {
        ...state,
        title: jsDeck.title,
        sections: jsDeck.sections,
        activeSectionIndex: newSectionIndex,
        activeCardIndex: newCardIndex,
        currentDeck: curr,
        currentCard: newCard,
      }
    }
    case INIT_SECTION_CARD: {
      const { title, sections, cardId, side, sectionId } = action.payload
      const activeSectionIndex = sections.findIndex(x => x.id == sectionId)
      const newSectionIndex = activeSectionIndex === -1 ? 0 : activeSectionIndex
      const activeCardIndex = sections[newSectionIndex].cards.findIndex(x => x.id == cardId)
      const newCardIndex = activeCardIndex === -1 ? 0 : activeCardIndex
      const newCard = {...sections[newSectionIndex].cards[newCardIndex], side: 'front'}
      // debugger
      return {
        ...state,
        activeSectionIndex: newSectionIndex,
        activeCardIndex: newCardIndex,
        currentCard: newCard,
        cardUrl: newCard.id,
        sectionUrl: sections[newSectionIndex].id,
        title,
        sections: sections
      }
    }
    case SELECT_CARD: {
      const c = state.sections[state.activeSectionIndex].cards
      const currentCard = c.find((x, i) => i === action.payload)
      return {
        ...state,
        activeCardIndex: action.payload,
        cardUrl: currentCard.id,
        currentCard: {...currentCard, side: 'front'},
      }
    }
    case SELECT_DECK: {
      const currentSection = state.sections[action.payload]
      const currentCard = currentSection.cards[0]
      return {
        ...state,
        activeSectionIndex: action.payload,
        activeCardIndex: 0,
        sectionUrl: state.sections.find((x, i) => i === action.payload).id,
        cardUrl: currentCard.id,
        currentCard: currentCard
      }
    } 
    case INIT_DECK: {
      const sections = state.sections
      const deckIndex = state.activeSectionIndex
      const cardIndex = state.activeCardIndex
      const currentCard = sections[deckIndex].cards[cardIndex]
      return {
        ...state,
        currentCard,
      }
    }
    case FLIP_CARD: {
      return {
        ...state,
        currentCard: {...state.currentCard, side: state.currentCard.side === 'front' ? 'back' : 'front'}
      }
    }
    case FORWARD_BACKWARD_CARD: {
      const indexToTry = state.activeCardIndex + action.diff
      const currentSection = state.sections[state.activeSectionIndex]
      let limit = currentSection.cards.length
      const allowedToShift = indexToTry >= 0 && indexToTry < limit
      const newIndex = allowedToShift ? indexToTry : state.activeCardIndex
      const currentCard = currentSection.cards[newIndex]
      return {
          ...state,
          activeCardIndex: newIndex,
          currentCard: currentCard,
          cardUrl: currentCard.id,
      }
    }
    case FORWARD_BACKWARD_DECK: {
      const deckToTry = state.activeSectionIndex + action.diff
      const sections = state.sections
      let lim = sections.length
      const allowed = deckToTry >= 0 && deckToTry < lim
      const newI = allowed ? deckToTry : state.activeSectionIndex
      const currSection = sections[newI]
      const currentCard = currSection.cards[0]
      console.log(newI)
      return {
          ...state,
          activeCardIndex: 0,
          activeSectionIndex: newI,
          currentCard,
          sectionUrl: currSection.id,
          cardUrl: currentCard.id,
          activeCardIndex: 0,
          timerRunning: false,
      }
    }
    default:
      return state
  }
}

export function initSectionCardItem(i) {
  const { cardId, deckId, sectionId } = i
  const deck = {}
  if (deckId === 'js') {
      return {
          type: INIT_JS_DECK,
          payload: {deckId, cardId, sectionId},
      }
  } else if (deckId === 'quiz') {
      return {
          type: INIT_QUIZ_DECK,
          payload: deckId,
      }
  } else if (deckId === 'preview') {
    return {
      type: INIT_SECTION_CARD,
      payload: deck,
    }
  } else {
      return dispatch => {
          axios.get(`/decks/${deckId}`).then(resp => {
              const initDeck = {
                ...resp.data,
                cardId,
                deckId,
                sectionId,
                side: 'front'
              }
              console.log(initDeck)
              dispatch({
                  type: INIT_SECTION_CARD,
                  payload: initDeck,
              })
          })
      }
  }
}

export function cycleDeckItem(index) {
  return {
      type: START_DECK_CYCLE
  }
}

export function pauseCycleDeckItem(index) {
  return {
      type: STOP_DECK_CYCLE
  }
}

// 6. custom hook
export function useDeck() {
  const dispatch = useDispatch()
  const deckState = useSelector(appState => appState.deckState)
  const { activeCardIndex, activeSectionIndex, currentCard } = deckState
  const currentSection = useSelector(appState => appState.deckState.sections[activeSectionIndex])
  const title = useSelector(appState => appState.deckState.title)
  const sections = useSelector(appState => appState.deckState.sections)
  const setDeckPreview = (d) => dispatch(initDeck('preview', d))
  const selectDeck = (index) => dispatch({type: SELECT_DECK, payload: index})
  const selectCard = (index) => dispatch({type: SELECT_CARD, payload: index})
  const manageSide = () => dispatch({type: FLIP_CARD})
  const initDeck = (id) => {}
  const initSectionCard = (i) => dispatch(initSectionCardItem(i))
  const cardUrl = useSelector(appState => appState.deckState.cardUrl)
  const sectionUrl = useSelector(appState => appState.deckState.sectionUrl)
  const updateSettings = () => {}
  const cycleDeck = () => dispatch(cycleDeckItem())
  const pauseCycleDeck = () => dispatch(pauseCycleDeckItem())
  const handleCardIndexChange = (diff) => dispatch({
        type: FORWARD_BACKWARD_CARD,
        diff
    })

  const handleDeckIndexChange = (diff) => dispatch({
        type: FORWARD_BACKWARD_DECK,
        diff
  })
  const answerCorrect = () => {}
  // const initSectionCardItem = () => {}
  return {
    title,
    sections,
    setDeckPreview,
    initDeck,
    initSectionCard,
    updateSettings,
    cycleDeck,
    pauseCycleDeck,
    handleCardIndexChange,
    handleDeckIndexChange,
    answerCorrect,
    activeCardIndex,
    currentCard,
    activeSectionIndex,
    selectDeck,
    selectCard,
    manageSide,
    currentSection,
    sectionUrl,
    cardUrl
  }
}
 