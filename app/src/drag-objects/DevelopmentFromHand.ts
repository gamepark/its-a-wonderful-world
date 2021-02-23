import DragObjectType from './DragObjectType'

type DevelopmentFromHand = {
  type: typeof DragObjectType.DEVELOPMENT_FROM_HAND
  card: number
}

export default DevelopmentFromHand

export function developmentFromHand(card: number) {
  return {type: DragObjectType.DEVELOPMENT_FROM_HAND, card}
}