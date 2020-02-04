import ChooseDevelopmentCard from './ChooseDevelopmentCard'
import DealDevelopmentCards, {DealDevelopmentCardsView} from './DealDevelopmentCards'
import RevealChosenCardsAndPassTheRest, {RevealChosenCardsAndPassTheRestView} from './RevealChosenCardsAndPassTheRest'

type Move = DealDevelopmentCards | ChooseDevelopmentCard | RevealChosenCardsAndPassTheRest

export default Move

export type MoveView<P> = DealDevelopmentCardsView<P> | ChooseDevelopmentCard | RevealChosenCardsAndPassTheRestView<P>