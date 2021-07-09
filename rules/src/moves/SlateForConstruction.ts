import GameState from '../GameState'
import GameView from '../GameView'
import {totalCost} from '../material/DevelopmentDetails'
import {getCardDetails} from '../material/Developments'
import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface SlateForConstruction {
  type: typeof MoveType.SlateForConstruction
  playerId: EmpireName
  card: number
}

export const slateForConstructionMove = (playerId: EmpireName, card: number): SlateForConstruction => ({
  type: MoveType.SlateForConstruction, playerId, card
})

export function slateForConstruction(state: GameState | GameView, move: SlateForConstruction) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  player.draftArea = player.draftArea.filter(card => card !== move.card)
  player.constructionArea.push({card: move.card, costSpaces: Array(totalCost(getCardDetails(move.card))).fill(null)})
}

export function isSlateForConstruction(move: Move | MoveView): move is SlateForConstruction {
  return move.type === MoveType.SlateForConstruction
}