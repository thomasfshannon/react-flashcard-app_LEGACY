import cardData from '../seed/js/dynamic-seed';

const topicState = {
    activeCardIndex: 0,
    activeDeckIndex: 0,
    cardGroup: cardData,
    currentDeck: {cards: []},
    currentCard: {},
    timerRunning: false,
    timeCycleFront: 3000,
    timeCycleBack: 3000,
    activeTheme: localStorage.getItem('theme') || 'light-mode',
    // currentCycle: 3000,

}

export function topic(state = topicState, action) {
    switch(action.type) {
        case 'INIT_DECK':
            const currDeck = state.cardGroup[state.activeDeckIndex]
            return {
                ...state,
                currentDeck: currDeck,
                currentCard: currDeck.cards[state.activeCardIndex]
            }
        case 'SELECT_DECK':
            return {
                ...state,
                currentDeck: state.cardGroup[action.index],
                activeDeckIndex: action.index,
                activeCardIndex: 0,
                currentCard: state.cardGroup[action.index].cards[0],
            }
        case 'SELECT_CARD':
            return {
                ...state,
                currentCard: state.currentDeck.cards[action.index],
                activeCardIndex: action.index,
            }
        case 'FLIP_CARD':
            const card = state.currentCard
            return {
                ...state,
                currentCard: {...card, side: card.side === 'front' ? 'back' : 'front'},
            }
        case 'TOGGLE_THEME':
            return {
                ...state,
                activeTheme: state.activeTheme === 'dark-mode' ? 'light-mode' : 'dark-mode'
            }
        case 'FORWARD_BACKWARD':
            const newIndex = state.activeCardIndex + action.diff
            return {
                ...state,
                activeCardIndex: newIndex,
                currentCard: state.currentDeck.cards[newIndex]

            }
        default:
            return state
    }
}