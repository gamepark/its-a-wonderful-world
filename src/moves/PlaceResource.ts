import Empire from '../material/empires/Empire'
import Resource from '../material/resources/Resource'
import MoveType from './MoveType'

export default interface PlaceResource {
  type: typeof MoveType.PlaceResource
  playerId: Empire
  resource: Resource
  constructionIndex?: number
  space?: number
}

export function placeResource(playerId: Empire, resource: Resource, constructionIndex?: number, space?: number): PlaceResource {
  const move: PlaceResource = {type: MoveType.PlaceResource, playerId, resource}
  if (constructionIndex && space) {
    move.constructionIndex = constructionIndex
    move.space = space
  }
  return move
}