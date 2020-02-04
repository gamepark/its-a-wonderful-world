import Development from '../material/Development'
import Empire from '../material/Empire'
import MoveType from './MoveType'

type RevealChosenCardsAndPassTheRest = { type: typeof MoveType.RevealChosenCardsAndPassTheRest }

export default RevealChosenCardsAndPassTheRest

export type RevealChosenCardsAndPassTheRestView<P> = RevealChosenCardsAndPassTheRest
  & { revealedCards: { [key in Empire]?: Development }, playerId?: P, receivedCards?: Development[] }

export function revealChosenCardsAndPassTheRest(): RevealChosenCardsAndPassTheRest {
  return {type: MoveType.RevealChosenCardsAndPassTheRest}
}

export function isRevealChosenCardsAndPassTheRestView<P>(move: RevealChosenCardsAndPassTheRest | RevealChosenCardsAndPassTheRestView<P>): move is RevealChosenCardsAndPassTheRestView<P> {
  return (move as RevealChosenCardsAndPassTheRestView<P>).revealedCards !== undefined
}