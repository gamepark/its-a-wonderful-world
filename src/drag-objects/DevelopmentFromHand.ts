import DragObjectType from './DragObjectType'

type DevelopmentFromHand = {
  type: typeof DragObjectType.DEVELOPMENT_FROM_HAND
  index: number
}

export default DevelopmentFromHand

export function developmentFromHand(index: number) {
  return {type: DragObjectType.DEVELOPMENT_FROM_HAND, index}
}