import Player from './Player'

type PlayerView = Omit<Player, 'hand' | 'chosenCard' | 'cardsToPass'> & {
  hand: number
  chosenCard: true | undefined
}

export default PlayerView