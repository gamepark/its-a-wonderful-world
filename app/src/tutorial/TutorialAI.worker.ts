import Game from '@gamepark/its-a-wonderful-world/Game'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import TutorialAI from './TutorialAI'

export async function ai(game: GameView | Game, playerId: EmpireName) {
  return new TutorialAI(playerId).play(game as Game)
}
