import Game from '@gamepark/its-a-wonderful-world/Game'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import TutorialAI from './TutorialAI'

export async function ai(game: Game, playerId: EmpireName) {
  return new TutorialAI(playerId).play(game)
}
