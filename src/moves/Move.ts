import ChooseDevelopmentCard from './ChooseDevelopmentCard'
import CompleteConstruction from './CompleteConstruction'
import DealDevelopmentCards, {DealDevelopmentCardsView} from './DealDevelopmentCards'
import DiscardLeftoverCards, {DiscardLeftoverCardsView} from './DiscardLeftoverCards'
import PassCards, {PassCardsView} from './PassCards'
import PlaceResource from './PlaceResource'
import Recycle from './Recycle'
import RevealChosenCards, {RevealChosenCardsView} from './RevealChosenCards'
import SlateForConstruction from './SlateForConstruction'
import StartPhase from './StartPhase'
import TransformIntoKrystallium from './TransformIntoKrystallium'

type Move = DealDevelopmentCards | ChooseDevelopmentCard | RevealChosenCards | PassCards | DiscardLeftoverCards | StartPhase | SlateForConstruction | Recycle
  | PlaceResource | CompleteConstruction | TransformIntoKrystallium

export default Move

export type MoveView<P> = DealDevelopmentCardsView<P> | ChooseDevelopmentCard | RevealChosenCardsView<P> | PassCardsView<P> | DiscardLeftoverCardsView
  | StartPhase | SlateForConstruction | Recycle | PlaceResource | CompleteConstruction | TransformIntoKrystallium