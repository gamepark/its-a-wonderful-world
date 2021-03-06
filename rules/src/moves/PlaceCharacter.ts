import GameState from '../GameState'
import GameView from '../GameView'
import Character from '../material/Character'
import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface PlaceCharacter {
  type: typeof MoveType.PlaceCharacter
  playerId: EmpireName
  character: Character
  card: number
  space: number
}

export const placeCharacterMove = (playerId: EmpireName, character: Character, card: number, space: number): PlaceCharacter => ({
  type: MoveType.PlaceCharacter, playerId, character, card, space
})

export function placeCharacter(state: GameState | GameView, move: PlaceCharacter) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  player.characters[move.character]--
  player.constructionArea.find(construction => construction.card === move.card)!.costSpaces[move.space] = move.character
}

export function isPlaceCharacter(move: Move | MoveView): move is PlaceCharacter {
  return move.type === MoveType.PlaceCharacter
}