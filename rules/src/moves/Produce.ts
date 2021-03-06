import GameState from '../GameState'
import GameView from '../GameView'
import {getProduction} from '../ItsAWonderfulWorld'
import Character, {ChooseCharacter} from '../material/Character'
import Resource from '../material/Resource'
import Player from '../Player'
import PlayerView from '../PlayerView'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface Produce {
  type: typeof MoveType.Produce
  resource: Resource
}

export const produceMove = (resource: Resource): Produce => ({type: MoveType.Produce, resource})

export function produce(state: GameState | GameView, move: Produce) {
  state.productionStep = move.resource
  let highestProduction = 0
  let singleMostPlayer: Player | PlayerView | undefined
  for (const player of state.players) {
    player.availableResources = new Array(getProduction(player, move.resource)).fill(move.resource)
    player.ready = false
    if (player.availableResources.length > highestProduction) {
      singleMostPlayer = player
      highestProduction = player.availableResources.length
    } else if (player.availableResources.length === highestProduction) {
      singleMostPlayer = undefined
    }
  }
  if (singleMostPlayer) {
    switch (move.resource) {
      case Resource.Materials:
      case Resource.Gold:
        singleMostPlayer.bonuses.push(Character.Financier)
        break
      case Resource.Energy:
      case Resource.Exploration:
        singleMostPlayer.bonuses.push(Character.General)
        break
      default:
        singleMostPlayer.bonuses.push(ChooseCharacter)
        break
    }
  }
}

export function isProduce(move: Move | MoveView): move is Produce {
  return move.type === MoveType.Produce
}