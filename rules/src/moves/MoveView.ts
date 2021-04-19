import {ChooseDevelopmentCardView} from './ChooseDevelopmentCard'
import {DealDevelopmentCardsView} from './DealDevelopmentCards'
import DiscardLeftoverCards, {DiscardLeftoverCardsView} from './DiscardLeftoverCards'
import Move from './Move'
import {PassCardsView} from './PassCards'
import RevealChosenCards, {RevealChosenCardsView} from './RevealChosenCards'

type MoveView = Exclude<Move, RevealChosenCards | DiscardLeftoverCards>
  | DealDevelopmentCardsView | ChooseDevelopmentCardView | RevealChosenCardsView | PassCardsView | DiscardLeftoverCardsView

export default MoveView