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

  play(move: LocalMove): LocalMove[] {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        revealDealtDevelopmentCards(this.state, move)
        break
      case MoveType.ChooseDevelopmentCard:
        chooseDevelopmentCardInView(this.state, move)
        break
      case MoveType.RevealChosenCards:
        revealChosenCardsInView(this.state, move)
        break
      case MoveType.PassCards:
        passCardsInView(this.state, move)
        break
      case MoveType.DiscardLeftoverCards:
        discardLeftOverCardsInView(this.state, move)
        break
      case MoveType.StartPhase:
        startPhase(this.state, move)
        break
      case MoveType.SlateForConstruction:
        slateForConstruction(this.state, move)
        break
      case MoveType.Recycle:
        recycle(this.state, move)
        break
      case MoveType.PlaceResource:
        placeResource(this.state, move)
        break
      case MoveType.CompleteConstruction:
        completeConstruction(this.state, move)
        break
      case MoveType.TransformIntoKrystallium:
        transformIntoKrystallium(this.state, move)
        break
      case MoveType.TellYouAreReady:
        tellYouAreReady(this.state, move)
        break
      case MoveType.Produce:
        produce(this.state, move)
        break
      case MoveType.ReceiveCharacter:
        receiveCharacter(this.state, move)
        break
      case MoveType.PlaceCharacter:
        placeCharacter(this.state, move)
        break
      case MoveType.Concede:
        concede(this.state, move)
        break
      case 'DisplayPlayer':
        displayPlayer(this.state, move)
        break
    }
    return []
  }

  canUndo(action: Action<MoveView, EmpireName>, consecutiveActions: Action<MoveView, EmpireName>[]): boolean {
    return canUndo(this.state, action, consecutiveActions)
  }

  restoreLocalMoves(localState: GameView) {
    this.state.displayedPlayer = localState.displayedPlayer
  }
}