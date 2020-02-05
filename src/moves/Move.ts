import ChooseDevelopmentCard from './ChooseDevelopmentCard'
import DealDevelopmentCards, {DealDevelopmentCardsView} from './DealDevelopmentCards'
import DiscardLeftoverCards, {DiscardLeftoverCardsView} from './DiscardLeftoverCards'
import PassCards, {PassCardsView} from './PassCards'
import RevealChosenCards, {RevealChosenCardsView} from './RevealChosenCards'
import StartPhase from './StartPhase'

type Move = DealDevelopmentCards | ChooseDevelopmentCard | RevealChosenCards | PassCards | DiscardLeftoverCards | StartPhase

export default Move

export type MoveView<P> = DealDevelopmentCardsView<P> | ChooseDevelopmentCard | RevealChosenCardsView<P> | PassCardsView<P> | DiscardLeftoverCardsView
  | StartPhase