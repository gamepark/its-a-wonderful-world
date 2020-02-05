import Empire from '../material/Empire'
import Resource from '../material/Resource'
import MoveType from './MoveType'

export default interface PlaceResource {
  type: typeof MoveType.PlaceResource
  playerId: Empire
  resource: Resource
  constructionIndex?: number
  space?: number
}

export function placeResource(playerId: Empire, resource: Resource, constructionIndex?: number, space?: number): PlaceResource {
  return {type: MoveType.PlaceResource, playerId, resource, constructionIndex, space}
}