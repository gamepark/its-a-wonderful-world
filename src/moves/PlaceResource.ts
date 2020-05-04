import EmpireName from '../material/empires/EmpireName'
import Resource from '../material/resources/Resource'
import Move from './Move'
import MoveType from './MoveType'

type PlaceResource = PlaceResourceOnEmpire | PlaceResourceOnConstruction

export default PlaceResource

export function placeResource(playerId: EmpireName, resource: Resource): PlaceResourceOnEmpire
export function placeResource(playerId: EmpireName, resource: Resource, card: number, space: number): PlaceResourceOnConstruction
export function placeResource(playerId: EmpireName, resource: Resource, card?: number, space?: number): PlaceResource {
  if (card !== undefined && space !== undefined) {
    return {type: MoveType.PlaceResource, playerId, resource, card, space}
  } else {
    return {type: MoveType.PlaceResource, playerId, resource}
  }
}

export function isPlaceResource(move: Move): move is PlaceResource {
  return move.type === MoveType.PlaceResource
}

export interface PlaceResourceOnEmpire {
  type: typeof MoveType.PlaceResource
  playerId: EmpireName
  resource: Resource
}

export interface PlaceResourceOnConstruction {
  type: typeof MoveType.PlaceResource
  playerId: EmpireName
  resource: Resource
  card: number
  space: number
}

export function isPlaceResourceOnConstruction(move: PlaceResource): move is PlaceResourceOnConstruction {
  return (move as PlaceResourceOnConstruction).card !== undefined && (move as PlaceResourceOnConstruction).space !== undefined
}