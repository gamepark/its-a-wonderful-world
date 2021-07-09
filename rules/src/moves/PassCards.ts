import GameState from '../GameState'
import GameView from '../GameView'
import {getCardType} from '../material/Developments'
import EmpireName from '../material/EmpireName'
import {isPlayer, isPlayerView} from '../typeguards'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type PassCards = { type: typeof MoveType.PassCards }

export default PassCards

export type PassCardsView = PassCards & { receivedCards: number[] }

export const passCardsMove: PassCards = {type: MoveType.PassCards}

export function passCards(state: GameState) {
  const players = state.players.filter(player => player.cardsToPass)
  const draftDirection = state.round % 2 ? -1 : 1
  for (let i = 0; i < players.length; i++) {
    const previousPlayer = players[(i + players.length + draftDirection) % players.length]
    players[i].hand = previousPlayer.cardsToPass!
  }
  players.forEach(player => delete player.cardsToPass)
}

export function passCardsInView(state: GameView, move: PassCards | PassCardsView) {
  const players = state.players.filter(player => player.cardsToPass)
  const draftDirection = state.round % 2 ? -1 : 1
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    if (isPlayerView(player)) {
      const previousPlayer = players[(i + players.length + draftDirection) % players.length]
      player.hiddenHand = isPlayer(previousPlayer) ? previousPlayer.cardsToPass!.map(getCardType) : previousPlayer.cardsToPass!
    } else if (isPassCardsView(move)) {
      player.hand = move.receivedCards
    }
  }
  players.forEach(player => delete player.cardsToPass)
}

export function isPassCards(move: Move | MoveView): move is (PassCards | PassCardsView) {
  return move.type === MoveType.PassCards
}

export function isPassCardsView(move: PassCards | PassCardsView): move is PassCardsView {
  return (move as PassCardsView).receivedCards !== undefined
}

export function getPassCardsView(state: GameState, playerId: EmpireName): PassCardsView {
  const players = state.players.filter(player => player.cardsToPass)
  const playerIndex = players.findIndex(player => player.empire === playerId)
  const draftDirection = state.round % 2 ? -1 : 1
  const playerPassingCards = players[(playerIndex + players.length + draftDirection) % players.length]
  return {type: MoveType.PassCards, receivedCards: playerPassingCards.cardsToPass!}
}
