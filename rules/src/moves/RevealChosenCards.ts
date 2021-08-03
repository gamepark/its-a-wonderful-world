import GameState from '../GameState'
import GameView from '../GameView'
import {numberOfCardsToDraft} from '../ItsAWonderfulWorld'
import {getCardDetails} from '../material/Developments'
import EmpireName from '../material/EmpireName'
import {isPlayer, isPlayerView} from '../typeguards'
import Move from './Move'
import MoveType from './MoveType'

type RevealChosenCards = { type: typeof MoveType.RevealChosenCards }

export default RevealChosenCards

export type RevealChosenCardsView = RevealChosenCards & {
  revealedCards: { [key in EmpireName]?: {card: number, index: number} }
}

export const revealChosenCardsMove: RevealChosenCards = {type: MoveType.RevealChosenCards}

export function revealChosenCards(state: GameState) {
  state.players.forEach(player => {
    if (player.chosenCard !== undefined) {
      player.hand = player.hand.filter(card => card !== player.chosenCard)
      player.draftArea.push(player.chosenCard)
      delete player.chosenCard
      if (player.draftArea.length < numberOfCardsToDraft) {
        player.cardsToPass = player.hand
      }
    }
  })
}

export function revealChosenCardsInView(state: GameView, move: RevealChosenCardsView) {
  state.players.forEach(player => {
    const revealedCard = move.revealedCards[player.empire]
    if (!revealedCard || revealedCard.card === undefined) return
    player.draftArea.push(revealedCard.card)
    if (isPlayer(player)) {
      player.hand = player.hand.filter(card => card !== revealedCard.card)
      delete player.chosenCard
    } else {
      player.hiddenHand.splice(player.hiddenHand.indexOf(getCardDetails(revealedCard.card).deck), 1)
      player.ready = false
    }
    if (player.draftArea.length < numberOfCardsToDraft) {
      player.cardsToPass = isPlayerView(player) ? player.hiddenHand : player.hand
    }
  })
}

export function isRevealChosenCards(move: Move): move is (RevealChosenCards | RevealChosenCardsView) {
  return move.type === MoveType.RevealChosenCards
}

export function isRevealChosenCardsView(move: RevealChosenCards | RevealChosenCardsView): move is RevealChosenCardsView {
  return (move as RevealChosenCardsView).revealedCards !== undefined
}

export function getRevealChosenCardsView(state: GameState): RevealChosenCardsView {
  const revealedCards = state.players.reduce<{ [key in EmpireName]?: { card: number, index: number } }>((revealedCards, player) => {
    if (player.chosenCard !== undefined) {
      revealedCards[player.empire] = {card: player.chosenCard, index: player.hand.indexOf(player.chosenCard)}
    }
    return revealedCards
  }, {})
  return {type: MoveType.RevealChosenCards, revealedCards}
}
