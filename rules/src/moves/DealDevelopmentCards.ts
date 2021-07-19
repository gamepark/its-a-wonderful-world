import GameState from '../GameState'
import GameView from '../GameView'
import {numberOfCardsToDraft} from '../ItsAWonderfulWorld'
import EmpireName from '../material/EmpireName'
import {isPlayer} from '../typeguards'
import MoveType from './MoveType'

type DealDevelopmentCards = { type: typeof MoveType.DealDevelopmentCards }

export default DealDevelopmentCards

export type DealDevelopmentCardsView = DealDevelopmentCards & { playerCards: number[] }

export const dealDevelopmentCardsMove: DealDevelopmentCards = {type: MoveType.DealDevelopmentCards}

const numberOfCardsDeal2Players = 10

function getRemainingPlayersToDealCardsTo(state: GameState | GameView) {
  const players = state.players.filter(player => !player.eliminated)
  if (players.length === 1) {
    players.push(state.players.filter(player => player.eliminated).sort((a, b) => b.eliminated! - a.eliminated!)[0])
  }
  return players
}

export function dealDevelopmentCards(state: GameState) {
  const players = getRemainingPlayersToDealCardsTo(state)
  const cardsToDeal = players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft
  players.forEach(player => {
    player.hand = state.deck.splice(0, cardsToDeal)
  })
}

export function revealDealtDevelopmentCards(state: GameView, move: DealDevelopmentCards | DealDevelopmentCardsView) {
  const players = getRemainingPlayersToDealCardsTo(state)
  const cardsToDeal = players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft
  players.forEach(player => {
    state.deck -= cardsToDeal
    if (isPlayer(player) && isDealDevelopmentCardsView(move)) {
      player.hand = move.playerCards
    } else {
      player.hand = cardsToDeal
    }
  })
}

export function isDealDevelopmentCardsView(move: DealDevelopmentCards | DealDevelopmentCardsView): move is DealDevelopmentCardsView {
  return (move as DealDevelopmentCardsView).playerCards !== undefined
}

export function getDealDevelopmentCardsView(state: GameState, playerId: EmpireName): DealDevelopmentCardsView {
  const players = getRemainingPlayersToDealCardsTo(state)
  const playerIndex = players.findIndex(player => player.empire === playerId)
  const cardsToDeal = players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft
  return {type: MoveType.DealDevelopmentCards, playerCards: state.deck.slice(playerIndex * cardsToDeal, (playerIndex + 1) * cardsToDeal)}
}