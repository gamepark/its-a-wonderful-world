import { CustomMove, isCreateItem, isCustomMoveType, isDeleteItemType, isMoveItemType, isMoveItemTypeAtOnce, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { Character, isCharacter } from '../material/Character'
import { CustomMoveType } from '../material/CustomMoveType'
import { Development, getCost, getDevelopmentDetails, getRemainingCost } from '../material/Development'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { isResource, Resource } from '../material/Resource'

/**
 * Abstract base class for phases where players can place resources on constructions.
 * Common to Planning and Production phases.
 */
export abstract class ConstructionRule extends SimultaneousRule<Empire, MaterialType, LocationType> {
  /**
   * Get the cubes placed on a construction card's cost spaces.
   */
  protected getCubesOnCard(cardIndex: number) {
    return this.material(MaterialType.ResourceCube).location(LocationType.ConstructionCardCost).parent(cardIndex)
  }

  /**
   * Get the character tokens placed on a construction card's cost spaces.
   */
  protected getCharactersOnCard(cardIndex: number) {
    return this.material(MaterialType.CharacterToken).location(LocationType.ConstructionCardCost).parent(cardIndex)
  }

  /**
   * Get the remaining cost for a card, taking into account cubes and character tokens already placed.
   */
  protected getRemainingCostForCard(cardIndex: number) {
    const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
    const development = card.id.front as Development

    const costLength = getCost(development).length
    const filledSpaces: (Resource | Character | undefined)[] = Array(costLength).fill(undefined)
    for (const cube of this.getCubesOnCard(cardIndex).getItems()) {
      filledSpaces[cube.location.x ?? 0] = cube.id as Resource
    }
    for (const token of this.getCharactersOnCard(cardIndex).getItems()) {
      filledSpaces[token.location.x ?? 0] = token.id as Character
    }

    return getRemainingCost(development, filledSpaces)
  }

  /**
   * Get the common construction-related legal moves for a player:
   * - Recycle cards from construction area
   * - Place available resources on constructions
   * - Place available resources on empire card
   * - Directly construct a card if player has enough resources
   * - End turn when no more resources to place
   */
  getConstructionMoves(playerId: Empire): MaterialMove[] {
    const moves: MaterialMove[] = []
    const constructionArea = this.material(MaterialType.DevelopmentCard).location(LocationType.ConstructionArea).player(playerId)
    const availableResources = this.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(playerId)

    // Player can recycle cards from construction area
    moves.push(
      ...constructionArea.moveItems({
        type: LocationType.Discard
      })
    )

    // Player can directly construct cards if they have enough resources
    for (const cardIndex of constructionArea.getIndexes()) {
      if (this.canPayRemainingCost(playerId, cardIndex)) {
        moves.push(
          this.material(MaterialType.DevelopmentCard).index(cardIndex).moveItem({
            type: LocationType.ConstructedDevelopments,
            player: playerId
          })
        )
      }
    }

    // Player can place available resources on constructions that need them
    const krystalliumStock = this.material(MaterialType.ResourceCube).location(LocationType.KrystalliumStock).player(playerId)

    for (const cardIndex of constructionArea.getIndexes()) {
      // Get remaining cost spaces
      const remainingCost = this.getRemainingCostForCard(cardIndex)

      // For each available resource, check if it can be placed on a remaining cost space
      for (const resourceIndex of availableResources.getIndexes()) {
        const availableResource = availableResources.getItem(resourceIndex)
        const resource = availableResource.id as Resource

        // Find cost spaces that accept this resource (or Krystallium for any resource)
        const validSpaces = remainingCost.filter(
          (cost) => (isResource(cost.item) && cost.item === resource) || (resource === Resource.Krystallium && isResource(cost.item))
        )

        for (const { space } of validSpaces) {
          moves.push(
            this.material(MaterialType.ResourceCube).index(resourceIndex).moveItem({
              type: LocationType.ConstructionCardCost,
              parent: cardIndex,
              x: space
            })
          )
        }
      }

      // Krystallium from stock can be placed on any resource cost space
      const resourceCostSpaces = remainingCost.filter((cost) => isResource(cost.item))
      if (resourceCostSpaces.length > 0) {
        for (const krystalliumIndex of krystalliumStock.getIndexes()) {
          for (const { space } of resourceCostSpaces) {
            moves.push(
              this.material(MaterialType.ResourceCube).index(krystalliumIndex).moveItem({
                type: LocationType.ConstructionCardCost,
                parent: cardIndex,
                x: space
              })
            )
          }
        }
      }
    }

    // Player can place character tokens on constructions that need them
    const playerCharacters = this.material(MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(playerId)
    for (const cardIndex of constructionArea.getIndexes()) {
      const remainingCost = this.getRemainingCostForCard(cardIndex)
      const characterCostSpaces = remainingCost.filter((cost) => isCharacter(cost.item))

      for (const tokenIndex of playerCharacters.getIndexes()) {
        const token = playerCharacters.getItem(tokenIndex)
        const character = token.id as Character
        const validSpaces = characterCostSpaces.filter((cost) => cost.item === character)

        for (const { space } of validSpaces) {
          moves.push(
            this.material(MaterialType.CharacterToken).index(tokenIndex).moveItem({
              type: LocationType.ConstructionCardCost,
              parent: cardIndex,
              x: space
            })
          )
        }
      }
    }

    // Player can place available resources on empire card (except krystallium which stays on empire)
    moves.push(
      ...availableResources
        .filter((item) => item.id !== Resource.Krystallium)
        .moveItems({
          type: LocationType.EmpireCardResources,
          player: playerId
        })
    )

    // Custom move to place all available non-krystallium resources on a card at once
    for (const cardIndex of constructionArea.getIndexes()) {
      if (this.getPlaceResourcesMoves(playerId, cardIndex).length > 0) {
        moves.push(this.customMove(CustomMoveType.PlaceResources, cardIndex))
      }
    }

    return moves
  }

  /**
   * Compute the greedy placement of available non-krystallium resources on a card.
   * Each distinct cube item is used at most once, each cost space is filled at most once.
   */
  getPlaceResourcesMoves(playerId: Empire, cardIndex: number): MaterialMove[] {
    const availableResources = this.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(playerId)
    const remainingCost = this.getRemainingCostForCard(cardIndex)

    // Build candidate moves: resource cube -> cost space
    const candidates: { resourceIndex: number; space: number }[] = []
    for (const resourceIndex of availableResources.getIndexes()) {
      const resource = availableResources.getItem(resourceIndex).id as Resource
      if (resource === Resource.Krystallium) continue
      for (const { space, item } of remainingCost) {
        if (isResource(item) && item === resource) {
          candidates.push({ resourceIndex, space })
        }
      }
    }

    // Sort by space to fill in order
    candidates.sort((a, b) => a.space - b.space)

    // Greedy assignment: each cube used at most once (respecting quantity), each space filled once
    const usedPerItem = new Map<number, number>()
    const usedSpaces = new Set<number>()
    const result: MaterialMove[] = []
    for (const { resourceIndex, space } of candidates) {
      if (usedSpaces.has(space)) continue
      const used = usedPerItem.get(resourceIndex) ?? 0
      const available = availableResources.getItem(resourceIndex).quantity ?? 1
      if (used >= available) continue
      usedPerItem.set(resourceIndex, used + 1)
      usedSpaces.add(space)
      result.push(
        this.material(MaterialType.ResourceCube).index(resourceIndex).moveItem({
          type: LocationType.ConstructionCardCost,
          parent: cardIndex,
          x: space
        }, 1)
      )
    }
    return result
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.PlaceResources)(move)) {
      const cardIndex = move.data as number
      const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
      const player = card.location.player as Empire
      return this.getPlaceResourcesMoves(player, cardIndex)
    }
    return []
  }

  /**
   * Check if player can end their turn (no available resources left)
   */
  canEndTurn(playerId: Empire): boolean {
    const availableResources = this.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(playerId)
    return availableResources.length === 0
  }

  /**
   * Handle recycling logic when a card is moved to discard.
   * Handle direct construction when a card is moved to ConstructedDevelopments.
   * Creates recycling bonus and handles cubes on the card.
   */
  beforeItemMove(move: ItemMove): MaterialMove[] {
    const consequences: MaterialMove[] = []

    if (isMoveItemType(MaterialType.DevelopmentCard)(move)) {
      // Get the card before it moves to find the player
      const card = this.material(MaterialType.DevelopmentCard).getItem(move.itemIndex)
      const player = card.location.player as Empire | undefined

      // If card is being directly constructed (moved to ConstructedDevelopments from ConstructionArea or DraftArea)
      // Skip if card is already complete (triggered by afterItemMove after placing last resource)
      const isFromConstructionOrDraft = card.location.type === LocationType.ConstructionArea || card.location.type === LocationType.DraftArea
      if (move.location.type === LocationType.ConstructedDevelopments && isFromConstructionOrDraft && player !== undefined) {
        const development = card.id.front as Development
        const cubesOnCard = this.getCubesOnCard(move.itemIndex)

        // Only handle direct construction (card not yet complete)
        // If card is already complete, it was triggered by afterItemMove which handles everything
        if (this.getRemainingCostForCard(move.itemIndex).length > 0) {
          // Pay the remaining cost
          const paymentMoves = this.payRemainingCost(player, move.itemIndex)
          consequences.push(...paymentMoves)

          // Delete cubes and character tokens already on the card
          if (cubesOnCard.length > 0) {
            consequences.push(cubesOnCard.deleteItemsAtOnce())
          }
          const charactersOnCard = this.getCharactersOnCard(move.itemIndex)
          if (charactersOnCard.length > 0) {
            consequences.push(charactersOnCard.deleteItemsAtOnce())
          }

          // Award construction bonuses
          consequences.push(...this.getConstructionBonusMoves(development, player))
        }
      }

      // If card is being recycled (moved to Discard), create recycling bonus resource
      if (move.location.type === LocationType.Discard && player !== undefined) {
        consequences.push(...this.getRecyclingMoves(move.itemIndex))
      }

      // Remember the player so afterItemMove can check unplaceable resources once the card has moved
      if (move.location.type !== LocationType.ConstructedDevelopments && player !== undefined) {
        this.memorize(Memory.CheckUnplaceableResources, player)
      }
    }

    // Handle batch moves (MoveItemsAtOnce) for recycling
    if (isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.Discard) {
      for (const cardIndex of move.indexes) {
        consequences.push(...this.getRecyclingMoves(cardIndex))
      }
      // Remember the player for unplaceable resource check in afterItemMove
      if (move.indexes.length > 0) {
        const card = this.material(MaterialType.DevelopmentCard).getItem(move.indexes[0])
        const player = card.location.player as Empire | undefined
        if (player !== undefined) {
          this.memorize(Memory.CheckUnplaceableResources, player)
        }
      }
    }

    // Before a cube is deleted, check if remaining cubes of the same resource will be unplaceable
    if (isDeleteItemType(MaterialType.ResourceCube)(move)) {
      const item = this.material(MaterialType.ResourceCube).getItem(move.itemIndex)
      if (item.location.type === LocationType.AvailableResources) {
        const player = item.location.player as Empire
        const resource = item.id as Resource
        const remaining = (item.quantity ?? 1) - (move.quantity ?? item.quantity ?? 1)
        if (remaining > 0 && !this.canResourceBePlaced(player, resource)) {
          for (let i = 0; i < remaining; i++) {
            consequences.push(
              this.material(MaterialType.ResourceCube).index(move.itemIndex).moveItem({
                type: LocationType.EmpireCardResources,
                player
              }, 1)
            )
          }
        }
      }
    }

    return consequences
  }

  /**
   * Handle krystallium transformation when a resource is placed on empire card.
   * Also auto-move resources that can't be placed anywhere after a card move.
   */
  afterItemMove(move: ItemMove): MaterialMove[] {
    const consequences: MaterialMove[] = []

    // Check if a resource cube or character token was placed on a construction card
    if (
      (isMoveItemType(MaterialType.ResourceCube)(move) || isMoveItemType(MaterialType.CharacterToken)(move)) &&
      move.location.type === LocationType.ConstructionCardCost
    ) {
      const cardIndex = move.location.parent as number
      const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
      const player = card.location.player as Empire

      // Check if card is now complete
      if (this.getRemainingCostForCard(cardIndex).length === 0) {
        // Card is complete - move to constructed developments
        consequences.push(
          this.material(MaterialType.DevelopmentCard).index(cardIndex).moveItem({
            type: LocationType.ConstructedDevelopments,
            player
          })
        )

        // Delete all cubes and character tokens on the card (they are consumed)
        const cubesToDelete = this.getCubesOnCard(cardIndex)
        if (cubesToDelete.length > 0) {
          consequences.push(cubesToDelete.deleteItemsAtOnce())
        }
        const charactersToDelete = this.getCharactersOnCard(cardIndex)
        if (charactersToDelete.length > 0) {
          consequences.push(charactersToDelete.deleteItemsAtOnce())
        }

        // Award construction bonuses
        const development = card.id.front as Development
        consequences.push(...this.getConstructionBonusMoves(development, player))

        // Remember to check unplaceable resources after the card has moved and bonuses are resolved
        this.memorize(Memory.CheckUnplaceableResources, player)
      } else {
        // Card not complete yet - check if any available resources can no longer be placed
        consequences.push(...this.getUnplaceableResourceMoves(player))
      }
    }

    if (isMoveItemType(MaterialType.ResourceCube)(move)) {
      if (move.location.type === LocationType.EmpireCardResources) {
        const player = move.location.player as Empire
        consequences.push(...this.getKrystalliumConversionMoves(player))
      }
    }

    // After a card move, check unplaceable resources for the player who owned the card (set in beforeItemMove)
    if (isMoveItemType(MaterialType.DevelopmentCard)(move) || isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move)) {
      const player = this.remind<Empire | undefined>(Memory.CheckUnplaceableResources)
      if (player !== undefined) {
        this.forget(Memory.CheckUnplaceableResources)
        consequences.push(...this.getUnplaceableResourceMoves(player))
      }
    }

    // After a resource is created, handle consequences based on destination
    if (isCreateItem(move) && move.itemType === MaterialType.ResourceCube) {
      if (move.item.location?.type === LocationType.AvailableResources) {
        const player = move.item.location.player as Empire
        consequences.push(...this.getUnplaceableResourceMoves(player))
      } else if (move.item.location?.type === LocationType.EmpireCardResources) {
        const player = move.item.location.player as Empire
        consequences.push(...this.getKrystalliumConversionMoves(player))
      }
    }

    return consequences
  }

  /**
   * Get moves to send unplaceable available resources to empire card.
   * A resource is unplaceable if it cannot be placed on any construction or draft card.
   */
  private getUnplaceableResourceMoves(player: Empire): MaterialMove[] {
    const moves: MaterialMove[] = []
    const availableResources = this.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(player)

    for (const resourceIndex of availableResources.getIndexes()) {
      const resourceItem = availableResources.getItem(resourceIndex)
      const resource = resourceItem.id as Resource

      if (!this.canResourceBePlaced(player, resource)) {
        const quantity = resourceItem.quantity ?? 1
        for (let i = 0; i < quantity; i++) {
          moves.push(
            this.material(MaterialType.ResourceCube).index(resourceIndex).moveItem({
              type: LocationType.EmpireCardResources,
              player
            }, 1)
          )
        }
      }
    }

    return moves
  }

  private getKrystalliumConversionMoves(player: Empire): MaterialMove[] {
    const empireResources = this.material(MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(player)
    if (empireResources.length < 5) return []
    return [
      empireResources.limit(5).deleteItemsAtOnce(),
      this.material(MaterialType.ResourceCube).createItem({
        id: Resource.Krystallium,
        location: { type: LocationType.KrystalliumStock, player }
      })
    ]
  }

  /**
   * Check if a resource can be placed on any construction card (remaining slots)
   * or any draft card (all slots).
   */
  private canResourceBePlaced(player: Empire, resource: Resource): boolean {
    // Check construction area cards (remaining cost only)
    const constructionArea = this.material(MaterialType.DevelopmentCard).location(LocationType.ConstructionArea).player(player)

    for (const cardIndex of constructionArea.getIndexes()) {
      const remainingCost = this.getRemainingCostForCard(cardIndex)
      if (remainingCost.some((cost) => (isResource(cost.item) && cost.item === resource) || (resource === Resource.Krystallium && isResource(cost.item))))
        return true
    }

    // Check draft area cards (all cost slots)
    const draftArea = this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(player)

    for (const cardIndex of draftArea.getIndexes()) {
      const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
      const development = card.id.front as Development
      const cost = getCost(development)
      if (cost.some((item) => (isResource(item) && item === resource) || (resource === Resource.Krystallium && isResource(item)))) return true
    }

    return false
  }

  /**
   * Get the moves to award construction bonuses for a completed development.
   */
  protected getConstructionBonusMoves(development: Development, player: Empire): MaterialMove[] {
    const moves: MaterialMove[] = []
    const details = getDevelopmentDetails(development)
    if (details.constructionBonus) {
      for (const bonus of details.constructionBonus) {
        if (isCharacter(bonus)) {
          moves.push(
            this.material(MaterialType.CharacterToken).createItem({
              id: bonus,
              location: {
                type: LocationType.PlayerCharacters,
                player,
                id: bonus
              }
            })
          )
        } else if (bonus === Resource.Krystallium) {
          moves.push(
            this.material(MaterialType.ResourceCube).createItem({
              id: Resource.Krystallium,
              location: {
                type: LocationType.KrystalliumStock,
                player
              }
            })
          )
        }
      }
    }
    return moves
  }

  /**
   * Get the moves for recycling a card (moved to Discard).
   * Handles recycling bonus, cubes on the card, and character tokens.
   */
  protected getRecyclingMoves(cardIndex: number): MaterialMove[] {
    const moves: MaterialMove[] = []
    const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
    const player = card.location.player! as Empire
    const development = card.id.front as Development
    const details = getDevelopmentDetails(development)

    // Check if this card was drafted this round
    const draftedCardsForPlayer = this.remind<Development[]>(Memory.DraftedCards, player)
    const isDraftedThisRound = draftedCardsForPlayer?.includes(development) ?? false

    const recyclingBonusDestination = isDraftedThisRound
      ? { type: LocationType.AvailableResources, player, id: details.recyclingBonus }
      : { type: LocationType.EmpireCardResources, player }
    moves.push(
      this.material(MaterialType.ResourceCube).createItem({
        id: details.recyclingBonus,
        location: recyclingBonusDestination
      })
    )

    const cubesOnCard = this.getCubesOnCard(cardIndex)

    // Krystallium cubes always go back to the krystallium stock
    moves.push(
      ...cubesOnCard
        .filter((item) => item.id === Resource.Krystallium)
        .moveItems({
          type: LocationType.KrystalliumStock,
          player
        })
    )

    // Non-krystallium cubes: recovered if drafted this round, lost otherwise
    const otherCubes = cubesOnCard.filter((item) => item.id !== Resource.Krystallium)
    if (isDraftedThisRound) {
      for (const cubeIndex of otherCubes.getIndexes()) {
        const cube = otherCubes.getItem(cubeIndex)
        moves.push(
          this.material(MaterialType.ResourceCube)
            .index(cubeIndex)
            .moveItem({
              type: LocationType.AvailableResources,
              player,
              id: cube.id as Resource
            })
        )
      }
    } else {
      moves.push(...otherCubes.deleteItems())
    }

    // Character tokens return to player
    for (const tokenIndex of this.getCharactersOnCard(cardIndex).getIndexes()) {
      const token = this.getCharactersOnCard(cardIndex).getItem(tokenIndex)
      moves.push(
        this.material(MaterialType.CharacterToken)
          .index(tokenIndex)
          .moveItem({
            type: LocationType.PlayerCharacters,
            player,
            id: token.id as Character
          })
      )
    }

    return moves
  }

  /**
   * Check if a player can pay the remaining cost of a card.
   * Takes into account: available resources, krystallium stock, and character tokens.
   */
  protected canPayRemainingCost(player: Empire, cardIndex: number): boolean {
    const remainingCost = this.getRemainingCostForCard(cardIndex)
    if (remainingCost.length === 0) return true

    // Count available resources
    const availableResources = this.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(player)
    const resourceCounts: Record<Resource, number> = {
      [Resource.Materials]: 0,
      [Resource.Energy]: 0,
      [Resource.Science]: 0,
      [Resource.Gold]: 0,
      [Resource.Exploration]: 0,
      [Resource.Krystallium]: 0
    }
    for (const item of availableResources.getItems()) {
      const resource = item.id as Resource
      resourceCounts[resource] += item.quantity ?? 1
    }

    // Count krystallium in stock
    const krystalliumStock = this.material(MaterialType.ResourceCube).location(LocationType.KrystalliumStock).player(player)
    let krystalliumCount = 0
    for (const item of krystalliumStock.getItems()) {
      krystalliumCount += item.quantity ?? 1
    }

    // Count character tokens
    const playerCharacters = this.material(MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(player)
    const characterCounts: Record<Character, number> = {
      [Character.Financier]: 0,
      [Character.General]: 0
    }
    for (const item of playerCharacters.getItems()) {
      const character = item.id as Character
      characterCounts[character] += item.quantity ?? 1
    }

    // Check if we can pay each remaining cost item
    let krystalliumNeeded = 0
    for (const { item } of remainingCost) {
      if (isResource(item)) {
        if (item === Resource.Krystallium) {
          // Krystallium cost must be paid with krystallium
          krystalliumNeeded++
        } else if (resourceCounts[item] > 0) {
          resourceCounts[item]--
        } else {
          // Need to use krystallium as substitute
          krystalliumNeeded++
        }
      } else if (isCharacter(item)) {
        if (characterCounts[item] > 0) {
          characterCounts[item]--
        } else {
          // Cannot pay character cost
          return false
        }
      }
    }

    // Check if we have enough krystallium (from available + stock)
    const totalKrystallium = resourceCounts[Resource.Krystallium] + krystalliumCount
    return totalKrystallium >= krystalliumNeeded
  }

  /**
   * Pay the remaining cost of a construction card.
   * Returns moves to delete/move the resources used as payment.
   * Uses krystallium as last resort.
   */
  protected payRemainingCost(player: Empire, cardIndex: number): MaterialMove[] {
    const moves: MaterialMove[] = []
    const remainingCost = this.getRemainingCostForCard(cardIndex)
    if (remainingCost.length === 0) return moves

    // Get available resources indexed by type with their quantities
    const availableResources = this.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(player)
    const availableByResource: Record<Resource, { index: number; remaining: number }[]> = {
      [Resource.Materials]: [],
      [Resource.Energy]: [],
      [Resource.Science]: [],
      [Resource.Gold]: [],
      [Resource.Exploration]: [],
      [Resource.Krystallium]: []
    }
    for (const index of availableResources.getIndexes()) {
      const item = availableResources.getItem(index)
      availableByResource[item.id as Resource].push({ index, remaining: item.quantity ?? 1 })
    }

    // Get krystallium stock with quantities
    const krystalliumStock = this.material(MaterialType.ResourceCube).location(LocationType.KrystalliumStock).player(player)
    const krystalliumStockItems: { index: number; remaining: number }[] = []
    for (const index of krystalliumStock.getIndexes()) {
      const item = krystalliumStock.getItem(index)
      krystalliumStockItems.push({ index, remaining: item.quantity ?? 1 })
    }

    // Get character tokens indexed by type with quantities
    const playerCharacters = this.material(MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(player)
    const charactersByType: Record<Character, { index: number; remaining: number }[]> = {
      [Character.Financier]: [],
      [Character.General]: []
    }
    for (const index of playerCharacters.getIndexes()) {
      const item = playerCharacters.getItem(index)
      charactersByType[item.id as Character].push({ index, remaining: item.quantity ?? 1 })
    }

    // Track how much to delete from each index
    const toDelete: Map<number, { type: MaterialType; quantity: number }> = new Map()

    const useResource = (items: { index: number; remaining: number }[], materialType: MaterialType) => {
      if (items.length === 0) return false
      const item = items[0]
      if (item.remaining <= 0) {
        items.shift()
        return useResource(items, materialType)
      }
      item.remaining--
      const existing = toDelete.get(item.index)
      if (existing) {
        existing.quantity++
      } else {
        toDelete.set(item.index, { type: materialType, quantity: 1 })
      }
      return true
    }

    // Sort remaining cost: resources first (non-krystallium), then krystallium costs
    // This ensures we use krystallium as last resort
    const sortedRemainingCost = [...remainingCost].sort((a, b) => {
      const aIsKrystalliumCost = a.item === Resource.Krystallium
      const bIsKrystalliumCost = b.item === Resource.Krystallium
      if (aIsKrystalliumCost && !bIsKrystalliumCost) return 1
      if (!aIsKrystalliumCost && bIsKrystalliumCost) return -1
      return 0
    })

    // Pay each remaining cost item
    for (const { item } of sortedRemainingCost) {
      if (isResource(item)) {
        if (item === Resource.Krystallium) {
          // Krystallium cost: prefer available krystallium, then stock
          if (!useResource(availableByResource[Resource.Krystallium], MaterialType.ResourceCube)) {
            useResource(krystalliumStockItems, MaterialType.ResourceCube)
          }
        } else if (!useResource(availableByResource[item], MaterialType.ResourceCube)) {
          // Use available krystallium as substitute
          if (!useResource(availableByResource[Resource.Krystallium], MaterialType.ResourceCube)) {
            // Use krystallium from stock as last resort
            useResource(krystalliumStockItems, MaterialType.ResourceCube)
          }
        }
      } else if (isCharacter(item)) {
        useResource(charactersByType[item], MaterialType.CharacterToken)
      }
    }

    // Create delete moves
    for (const [index, { type, quantity }] of toDelete) {
      moves.push(this.material(type).index(index).deleteItem(quantity))
    }

    return moves
  }
}
