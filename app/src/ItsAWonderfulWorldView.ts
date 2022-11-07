import canUndo from '@gamepark/its-a-wonderful-world/canUndo'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {getPredictableAutomaticMoves, isTurnToPlay} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {chooseDevelopmentCardInView} from '@gamepark/its-a-wonderful-world/moves/ChooseDevelopmentCard'
import {completeConstruction} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import {concede} from '@gamepark/its-a-wonderful-world/moves/Concede'
import {revealDealtDevelopmentCards} from '@gamepark/its-a-wonderful-world/moves/DealDevelopmentCards'
import {discardLeftOverCardsInView} from '@gamepark/its-a-wonderful-world/moves/DiscardLeftoverCards'
import MoveType from '@gamepark/its-a-wonderful-world/moves/MoveType'
import MoveView from '@gamepark/its-a-wonderful-world/moves/MoveView'
import {passCardsInView} from '@gamepark/its-a-wonderful-world/moves/PassCards'
import {placeCharacter} from '@gamepark/its-a-wonderful-world/moves/PlaceCharacter'
import {placeResource} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import {produce} from '@gamepark/its-a-wonderful-world/moves/Produce'
import {receiveCharacter} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import {recycle} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import {revealChosenCardsInView} from '@gamepark/its-a-wonderful-world/moves/RevealChosenCards'
import {slateForConstruction} from '@gamepark/its-a-wonderful-world/moves/SlateForConstruction'
import {startPhase} from '@gamepark/its-a-wonderful-world/moves/StartPhase'
import {tellYouAreReady} from '@gamepark/its-a-wonderful-world/moves/TellYouAreReady'
import {transformIntoKrystallium} from '@gamepark/its-a-wonderful-world/moves/TransformIntoKrystallium'
import {Action, Rules, Undo} from '@gamepark/rules-api'
import DisplayPlayer, {displayPlayer} from './moves/DisplayPlayer'

type LocalMove = MoveView | DisplayPlayer

export default class ItsAWonderfulWorldView extends Rules<GameView, LocalMove, EmpireName> implements Undo<GameView, MoveView, EmpireName> {
  isTurnToPlay(playerId: EmpireName): boolean {
    return isTurnToPlay(this.state, playerId)
  }

  getAutomaticMoves(): MoveView[] {
    const move = getPredictableAutomaticMoves(this.state)
    return move ? [move] : []
  }

  play(move: LocalMove): void {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        return revealDealtDevelopmentCards(this.state, move)
      case MoveType.ChooseDevelopmentCard:
        return chooseDevelopmentCardInView(this.state, move)
      case MoveType.RevealChosenCards:
        return revealChosenCardsInView(this.state, move)
      case MoveType.PassCards:
        return passCardsInView(this.state, move)
      case MoveType.DiscardLeftoverCards:
        return discardLeftOverCardsInView(this.state, move)
      case MoveType.StartPhase:
        return startPhase(this.state, move)
      case MoveType.SlateForConstruction:
        return slateForConstruction(this.state, move)
      case MoveType.Recycle:
        return recycle(this.state, move)
      case MoveType.PlaceResource:
        return placeResource(this.state, move)
      case MoveType.CompleteConstruction:
        return completeConstruction(this.state, move)
      case MoveType.TransformIntoKrystallium:
        return transformIntoKrystallium(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.Produce:
        return produce(this.state, move)
      case MoveType.ReceiveCharacter:
        return receiveCharacter(this.state, move)
      case MoveType.PlaceCharacter:
        return placeCharacter(this.state, move)
      case MoveType.Concede:
        return concede(this.state, move)
      case 'DisplayPlayer':
        return displayPlayer(this.state, move)
    }
  }

  canUndo(action: Action<MoveView, EmpireName>, consecutiveActions: Action<MoveView, EmpireName>[]): boolean {
    return canUndo(this.state, action, consecutiveActions)
  }

  restoreLocalMoves(localState: GameView) {
    this.state.displayedPlayer = localState.displayedPlayer
  }
}