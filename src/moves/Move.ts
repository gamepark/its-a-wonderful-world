import ChooseDevelopmentCard from './ChooseDevelopmentCard'
import CompleteConstruction from './CompleteConstruction'
import DealDevelopmentCards, {DealDevelopmentCardsView} from './DealDevelopmentCards'
import DiscardLeftoverCards, {DiscardLeftoverCardsView} from './DiscardLeftoverCards'
import PlaceCharacter from './PlaceCharacter'
import PassCards, {PassCardsView} from './PassCards'
import PlaceResource from './PlaceResource'
import Produce from './Produce'
import ReceiveCharacter from './ReceiveCharacter'
import Recycle from './Recycle'
import RevealChosenCards, {RevealChosenCardsView} from './RevealChosenCards'
import SlateForConstruction from './SlateForConstruction'
import StartPhase from './StartPhase'
import TellYouAreReady from './TellYouAreReady'
import TransformIntoKrystallium from './TransformIntoKrystallium'

type Move = DealDevelopmentCards | ChooseDevelopmentCard | RevealChosenCards | PassCards | DiscardLeftoverCards | StartPhase | SlateForConstruction | Recycle
  | PlaceResource | CompleteConstruction | TransformIntoKrystallium | TellYouAreReady | Produce | ReceiveCharacter | PlaceCharacter

export default Move

export type MoveView<P> = DealDevelopmentCardsView<P> | ChooseDevelopmentCard | RevealChosenCardsView<P> | PassCardsView<P> | DiscardLeftoverCardsView
  | StartPhase | SlateForConstruction | Recycle | PlaceResource | CompleteConstruction | TransformIntoKrystallium | TellYouAreReady | Produce | ReceiveCharacter
  | PlaceCharacter