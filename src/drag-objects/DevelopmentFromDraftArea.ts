import DragObjectType from './DragObjectType'

type DevelopmentFromDraftArea = {
  type: typeof DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA
  index: number
}

export default DevelopmentFromDraftArea

export function developmentFromDraftArea(index: number) {
  return {type: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA, index}
}