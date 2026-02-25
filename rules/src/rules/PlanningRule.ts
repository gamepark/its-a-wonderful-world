import { CustomMove, isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { CustomMoveType } from '../material/CustomMoveType'
import { Development } from '../material/Development'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ConstructionRule } from './ConstructionRule'
import { RuleId } from './RuleId'

/**
 * Planning phase where players simultaneously decide what to do with their drafted cards.
 * Players can:
 * - Slate a card for construction (move to construction area)
 * - Recycle a card from draft area OR construction area for resources
 *   - If recycling a card drafted this round: resource goes to AvailableResources (+ any cubes on it)
 *   - If recycling an older construction: resource goes to EmpireCardResources, cubes are lost
 * When all cards from draft area are processed, player automatically ends turn
 * When all players are done, move to Production phase
 */
export class PlanningRule extends ConstructionRule {
  onRuleStart(): MaterialMove[] {
    // Memorize the 7 cards drafted by each player this round
    for (const empire of this.game.players) {
      const draftedCards = this.material(MaterialType.DevelopmentCard)
        .location(LocationType.DraftArea)
        .player(empire)
        .getItems()
        .map((item) => item.id.front as Development)

      this.memorize(Memory.DraftedCards, draftedCards, empire)
    }

    return []
  }

  getActivePlayerLegalMoves(playerId: Empire): MaterialMove[] {
    const moves: MaterialMove[] = []
    const draftArea = this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(playerId)

    // Player can slate each card from draft area for construction
    moves.push(
      ...draftArea.moveItems({
        type: LocationType.ConstructionArea,
        player: playerId
      })
    )

    // Player can recycle each card from draft area
    moves.push(
      ...draftArea.moveItems({
        type: LocationType.Discard
      })
    )

    // Player can directly construct drafted cards if they have enough resources
    for (const cardIndex of draftArea.getIndexes()) {
      if (this.canPayRemainingCost(playerId, cardIndex)) {
        moves.push(
          this.material(MaterialType.DevelopmentCard).index(cardIndex).moveItem({
            type: LocationType.ConstructedDevelopments,
            player: playerId
          })
        )
      }
    }

    // Add common construction moves (recycle from construction area, place resources)
    moves.push(...this.getConstructionMoves(playerId))

    // Custom moves for batch operations (only if there are cards in draft area)
    if (draftArea.length > 0) {
      moves.push(this.customMove(CustomMoveType.SlateAllForConstruction, playerId))
      moves.push(this.customMove(CustomMoveType.RecycleAll, playerId))
    }

    // Player can end their turn if they have processed all drafted cards and placed all resources
    if (draftArea.length === 0 && this.canEndTurn(playerId)) {
      moves.push(this.endPlayerTurn(playerId))
    }

    return moves
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    const playerId = move.data as Empire
    const draftArea = this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(playerId)

    if (isCustomMoveType(CustomMoveType.SlateAllForConstruction)(move)) {
      return [
        draftArea
          .sort((item) => item.location.x!)
          .moveItemsAtOnce({
            type: LocationType.ConstructionArea,
            player: playerId
          })
      ]
    }

    if (isCustomMoveType(CustomMoveType.RecycleAll)(move)) {
      return [
        draftArea
          .sort((item) => item.location.x!)
          .moveItemsAtOnce({
            type: LocationType.Discard
          })
      ]
    }

    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    // All players are done planning, move to Production phase (starts with Materials)
    return [this.startSimultaneousRule(RuleId.MaterialsProduction)]
  }

  onRuleEnd() {
    this.forget(Memory.DraftedCards)
    return []
  }
}
