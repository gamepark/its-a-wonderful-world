import EmpireName from './material/empires/EmpireName'
import TutorialAI from './TutorialAI'
import Game from './types/Game'

export async function ai(game: Game, playerId: EmpireName) {
  return new TutorialAI(playerId).play(game)
}
