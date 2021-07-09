import GameState from '../GameState'
import GameView from '../GameView'
import {getCardDetails} from '../material/Developments'
import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface Recycle {
  type: typeof MoveType.Recycle
  playerId: EmpireName
  card: number
}

export const recycleMove = (playerId: EmpireName, card: number): Recycle => ({
  type: MoveType.Recycle, playerId, card
})

export function recycle(state: GameState | GameView, move: Recycle) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  const indexInDraftArea = player.draftArea.findIndex(card => card === move.card)
  const development = getCardDetails(move.card)
  if (indexInDraftArea !== -1) {
    player.draftArea.splice(indexInDraftArea, 1)
    player.availableResources.push(development.recyclingBonus)
  } else {
    player.constructionArea = player.constructionArea.filter(construction => construction.card !== move.card)
    player.bonuses.push(development.recyclingBonus)
  }
  state.discard.push(move.card)
}

export function isRecycle(move: Move | MoveView): move is Recycle {
  return move.type === MoveType.Recycle
}