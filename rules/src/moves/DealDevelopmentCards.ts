import GameState from '../GameState'
import GameView from '../GameView'
import {numberOfCardsToDraft} from '../ItsAWonderfulWorld'
import DeckType from '../material/DeckType'
import EmpireName from '../material/EmpireName'
import Player from '../Player'
import PlayerView from '../PlayerView'
import {isPlayer} from '../typeguards'
import MoveType from './MoveType'

type DealDevelopmentCards = { type: typeof MoveType.DealDevelopmentCards }

export default DealDevelopmentCards

export type DealDevelopmentCardsView = DealDevelopmentCards & { playerCards: number[] }

export const dealDevelopmentCardsMove: DealDevelopmentCards = {type: MoveType.DealDevelopmentCards}

const numberOfCardsDeal2Players = 10

const ascensionCardsToDealByDefault = 2
const ascensionCardsToDeal2Players = 3

function getRemainingPlayersToDealCardsTo<T extends Player | PlayerView>(players: T[]): T[] {
  const result = players.filter(player => !player.eliminated)
  if (result.length === 1) {
    result.push(players.filter(player => player.eliminated).sort((a, b) => b.eliminated! - a.eliminated!)[0])
  }
  return result
}

export function dealDevelopmentCards(state: GameState) {
  const players = getRemainingPlayersToDealCardsTo(state.players)
  const ascensionCardsToDeal = getAscensionCardsToDeal(state, players.length)
  const cardsToDeal = (players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft) - ascensionCardsToDeal
  for (const player of players) {
    player.hand = state.deck.splice(0, cardsToDeal)
    if (state.ascensionDeck) {
      player.hand.push(...state.ascensionDeck.splice(0, ascensionCardsToDeal))
    }
  }
}

export function revealDealtDevelopmentCards(state: GameView, move: DealDevelopmentCards | DealDevelopmentCardsView) {
  const players = getRemainingPlayersToDealCardsTo(state.players)
  const ascensionCardsToDeal = getAscensionCardsToDeal(state, players.length)
  const cardsToDeal = (players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft) - ascensionCardsToDeal
  for (const player of players) {
    state.deck -= cardsToDeal
    if (state.ascensionDeck) {
      state.ascensionDeck -= ascensionCardsToDeal
    }
    if (isPlayer(player)) {
      if (!isDealDevelopmentCardsView(move)) throw new Error('Players cards expected')
      player.hand = move.playerCards
    } else {
      player.hiddenHand = Array(cardsToDeal).fill(DeckType.Default)
      if (state.ascensionDeck) {
        player.hiddenHand.push(...Array(ascensionCardsToDeal).fill(DeckType.Ascension))
      }
    }
  }
}

function getAscensionCardsToDeal(state: GameState | GameView, players: number) {
  if (!state.ascensionDeck) return 0
  return players === 2 ? ascensionCardsToDeal2Players : ascensionCardsToDealByDefault
}

export function isDealDevelopmentCardsView(move: DealDevelopmentCards | DealDevelopmentCardsView): move is DealDevelopmentCardsView {
  return (move as DealDevelopmentCardsView).playerCards !== undefined
}

export function getDealDevelopmentCardsView(state: GameState, playerId: EmpireName): DealDevelopmentCardsView {
  const players = getRemainingPlayersToDealCardsTo(state.players)
  const playerIndex = players.findIndex(player => player.empire === playerId)
  const ascensionCardsToDeal = getAscensionCardsToDeal(state, players.length)
  const cardsToDeal = (players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft) - ascensionCardsToDeal
  const playerCards = state.deck.slice(playerIndex * cardsToDeal, (playerIndex + 1) * cardsToDeal)
  if (state.ascensionDeck) {
    playerCards.push(...state.ascensionDeck.slice(playerIndex * ascensionCardsToDeal, (playerIndex + 1) * ascensionCardsToDeal))
  }
  return {type: MoveType.DealDevelopmentCards, playerCards}
}