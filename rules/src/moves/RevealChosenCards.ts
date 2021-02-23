import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'

type RevealChosenCards = { type: typeof MoveType.RevealChosenCards }

export default RevealChosenCards

export type RevealChosenCardsView = RevealChosenCards
  & { revealedCards: { [key in EmpireName]?: number } }

export function revealChosenCards(): RevealChosenCards {
  return {type: MoveType.RevealChosenCards}
}

export function isRevealChosenCards(move: Move): move is (RevealChosenCards | RevealChosenCardsView) {
  return move.type === MoveType.RevealChosenCards
}

export function isRevealChosenCardsView(move: RevealChosenCards | RevealChosenCardsView): move is RevealChosenCardsView {
  return (move as RevealChosenCardsView).revealedCards !== undefined
}