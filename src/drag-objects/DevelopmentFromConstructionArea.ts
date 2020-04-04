import DragObjectType from './DragObjectType'

type DevelopmentFromConstructionArea = {
  type: typeof DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA
  card: number
}

export default DevelopmentFromConstructionArea

export function developmentFromConstructionArea(card: number) {
  return {type: DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA, card}
}