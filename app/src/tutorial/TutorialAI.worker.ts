import GameState from '@gamepark/its-a-wonderful-world/GameState'
import ItsAWonderfulWorld from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {Dummy} from '@gamepark/rules-api'
import TutorialAI from './TutorialAI'

export async function ai(game: GameState, playerId: EmpireName) {
  try {
    return new TutorialAI(playerId).play(game as GameState)
  } catch (e) {
    console.error(e)
    const dummy = new Dummy(ItsAWonderfulWorld)
    return dummy.getRandomMove(game, playerId)
  }
}
