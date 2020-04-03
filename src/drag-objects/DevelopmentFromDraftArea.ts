import DragObjectType from './DragObjectType'

type DevelopmentFromDraftArea = {
  type: typeof DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA
  card: number
}

export default DevelopmentFromDraftArea

export function developmentFromDraftArea(card: number) {
  return {type: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA, card}
}