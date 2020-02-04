import ChooseDevelopmentCard from './ChooseDevelopmentCard'
import DealDevelopmentCards, {DealDevelopmentCardsView} from './DealDevelopmentCards'

type Move = DealDevelopmentCards | ChooseDevelopmentCard

export default Move

export type MoveView<P> = DealDevelopmentCardsView<P> | ChooseDevelopmentCard