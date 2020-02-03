import MoveType from './MoveType'

type DealDevelopmentCards = { type: typeof MoveType.DealDevelopmentCards }

export default DealDevelopmentCards

export function dealDevelopmentCards(): DealDevelopmentCards {
  return {type: MoveType.DealDevelopmentCards}
}