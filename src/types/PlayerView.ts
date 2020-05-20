import Player from './Player'

type PlayerView = Omit<Player, 'hand' | 'chosenCard' | 'cardsToPass'> & {
  hand: number
  chosenCard: boolean
}

export default PlayerView