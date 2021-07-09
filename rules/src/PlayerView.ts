import DeckType from './material/DeckType'
import Player from './Player'

type PlayerView = Omit<Player, 'hand' | 'chosenCard' | 'cardsToPass'> & {
  hiddenHand: DeckType[]
  cardsToPass?: DeckType[]
}

export default PlayerView