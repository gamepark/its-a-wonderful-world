import Resource from '../material/resources/Resource'
import DragObjectType from './DragObjectType'

type ResourceFromBoard = {
  type: typeof DragObjectType.RESOURCE_FROM_BOARD
  resource: Resource
}

export default ResourceFromBoard

export function resourceFromBoard(resource: Resource) {
  return {type: DragObjectType.RESOURCE_FROM_BOARD, resource}
}