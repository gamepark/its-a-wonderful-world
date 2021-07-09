import GameState from '../GameState'
import GameView from '../GameView'
import {isPlayerView} from '../typeguards'
import MoveType from './MoveType'

type DiscardLeftoverCards = { type: typeof MoveType.DiscardLeftoverCards }

export default DiscardLeftoverCards

export type DiscardLeftoverCardsView = DiscardLeftoverCards & { discardedCards: number[] }

export const discardLeftOverCardsMove: DiscardLeftoverCards = {type: MoveType.DiscardLeftoverCards}

export function discardLeftOverCards(state: GameState) {
  state.players.forEach(player => state.discard.push(...player.hand.splice(0)))
}

export function discardLeftOverCardsInView(state: GameView, move: DiscardLeftoverCardsView) {
  state.players.forEach(player => {
    if (isPlayerView(player)) {
      player.hiddenHand = []
    } else {
      player.hand = []
    }
  })
  state.discard.push(...move.discardedCards)
}

export function isDiscardLeftoverCardsView(move: DiscardLeftoverCards | DiscardLeftoverCardsView): move is DiscardLeftoverCardsView {
  return (move as DiscardLeftoverCardsView).discardedCards !== undefined
}

export function getDiscardLeftoverCardsView(state: GameState): DiscardLeftoverCardsView {
  return {type: MoveType.DiscardLeftoverCards, discardedCards: state.players.flatMap(player => player.hand)}
}
