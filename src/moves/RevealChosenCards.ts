import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

type RevealChosenCards = { type: typeof MoveType.RevealChosenCards }

export default RevealChosenCards

export type RevealChosenCardsView = RevealChosenCards
  & { revealedCards: { [key in EmpireName]?: number } }

export function revealChosenCards(): RevealChosenCards {
  return {type: MoveType.RevealChosenCards}
}

export function isRevealChosenCardsView(move: RevealChosenCards | RevealChosenCardsView): move is RevealChosenCardsView {
  return (move as RevealChosenCardsView).revealedCards !== undefined
}