import Move, {MoveView} from './Move'
import MoveType from './MoveType'

type PassCards = { type: typeof MoveType.PassCards }

export default PassCards

export type PassCardsView = PassCards & { receivedCards: number[] }

export function passCards(): PassCards {
  return {type: MoveType.PassCards}
}

export function isPassCards(move: Move | MoveView): move is (PassCards | PassCardsView) {
  return move.type === MoveType.PassCards
}

export function isPassCardsView(move: PassCards | PassCardsView): move is PassCardsView {
  return (move as PassCardsView).receivedCards !== undefined
}