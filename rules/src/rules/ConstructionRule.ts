import { isCreateItem, isMoveItemType, isMoveItemTypeAtOnce, ItemMove, MaterialMove, MoveItemsAtOnce, SimultaneousRule } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { Character, isCharacter } from '../material/Character'
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

    return moves
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
          consequences.push(...this.payRemainingCost(player, move.itemIndex))

          // Delete cubes and character tokens already on the card
          if (cubesOnCard.length > 0) {
            consequences.push(cubesOnCard.deleteItemsAtOnce())
          }
          const charactersOnCard = this.getCharactersOnCard(move.itemIndex)
          if (charactersOnCard.length > 0) {
            consequences.push(charactersOnCard.deleteItemsAtOnce())
          }

          // Award construction bonuses
          const details = getDevelopmentDetails(development)
          if (details.constructionBonus) {
            for (const bonus of details.constructionBonus) {
              if (isCharacter(bonus)) {
                consequences.push(
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
                consequences.push(
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
        }
      }

      // If card is being recycled (moved to Discard), create recycling bonus resource
      if (move.location.type === LocationType.Discard && player !== undefined) {
        const development = card.id.front as Development
        const details = getDevelopmentDetails(development)

        // Check if this card was drafted this round
        const draftedCardsForPlayer = this.remind<Development[]>(Memory.DraftedCards, player)
        const isDraftedThisRound = draftedCardsForPlayer?.includes(development) ?? false

        if (isDraftedThisRound) {
          // New card drafted this round: recycling bonus goes to AvailableResources
          consequences.push(
            this.material(MaterialType.ResourceCube).createItem({
              id: details.recyclingBonus,
              location: {
                type: LocationType.AvailableResources,
                player,
                id: details.recyclingBonus
              }
            })
          )

          const cubesOnCard = this.getCubesOnCard(move.itemIndex)

          // Krystallium cubes always go to the krystallium stock
          const krystalliumCubes = cubesOnCard.filter((item) => item.id === Resource.Krystallium)
          consequences.push(
            ...krystalliumCubes.moveItems({
              type: LocationType.KrystalliumStock,
              player
            })
          )

          // Other cubes go to AvailableResources (each with its resource type as location.id)
          for (const cubeIndex of cubesOnCard.filter((item) => item.id !== Resource.Krystallium).getIndexes()) {
            const cube = cubesOnCard.getItem(cubeIndex)
            consequences.push(
              this.material(MaterialType.ResourceCube).index(cubeIndex).moveItem({
                type: LocationType.AvailableResources,
                player,
                id: cube.id as Resource
              })
            )
          }

          // Character tokens return to player
          for (const tokenIndex of this.getCharactersOnCard(move.itemIndex).getIndexes()) {
            const token = this.getCharactersOnCard(move.itemIndex).getItem(tokenIndex)
            consequences.push(
              this.material(MaterialType.CharacterToken).index(tokenIndex).moveItem({
                type: LocationType.PlayerCharacters,
                player,
                id: token.id as Character
              })
            )
          }
        } else {
          // Old construction from previous round: recycling bonus goes to EmpireCardResources
          consequences.push(
            this.material(MaterialType.ResourceCube).createItem({
              id: details.recyclingBonus,
              location: {
                type: LocationType.EmpireCardResources,
                player
              }
            })
          )

          const cubesOnCard = this.getCubesOnCard(move.itemIndex)

          // Krystallium cubes are always recovered to the player's krystallium stock
          const krystalliumCubes = cubesOnCard.filter((item) => item.id === Resource.Krystallium)
          consequences.push(
            ...krystalliumCubes.moveItems({
              type: LocationType.KrystalliumStock,
              player
            })
          )

          // Other cubes are lost (deleted)
          const otherCubes = cubesOnCard.filter((item) => item.id !== Resource.Krystallium)
          consequences.push(...otherCubes.deleteItems())

          // Character tokens return to player
          for (const tokenIndex of this.getCharactersOnCard(move.itemIndex).getIndexes()) {
            const token = this.getCharactersOnCard(move.itemIndex).getItem(tokenIndex)
            consequences.push(
              this.material(MaterialType.CharacterToken).index(tokenIndex).moveItem({
                type: LocationType.PlayerCharacters,
                player,
                id: token.id as Character
              })
            )
          }
        }
      }
    }

    // Handle batch moves (MoveItemsAtOnce) for recycling
    if (isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move)) {
      const batchMove = move as MoveItemsAtOnce<Empire, MaterialType, LocationType>
      if (batchMove.location.type === LocationType.Discard) {
        for (const cardIndex of batchMove.indexes) {
          const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
          const player = card.location.player as Empire | undefined
          if (player === undefined) continue

          const development = card.id.front as Development
          const details = getDevelopmentDetails(development)

          // Check if this card was drafted this round
          const draftedCardsForPlayer = this.remind<Development[]>(Memory.DraftedCards, player)
          const isDraftedThisRound = draftedCardsForPlayer?.includes(development) ?? false

          if (isDraftedThisRound) {
            // New card drafted this round: recycling bonus goes to AvailableResources
            consequences.push(
              this.material(MaterialType.ResourceCube).createItem({
                id: details.recyclingBonus,
                location: {
                  type: LocationType.AvailableResources,
                  player,
                  id: details.recyclingBonus
                }
              })
            )

            // Note: cubes on draft area cards are not expected, but handle just in case
            const cubesOnCard = this.getCubesOnCard(cardIndex)
            const krystalliumCubes = cubesOnCard.filter((item) => item.id === Resource.Krystallium)
            consequences.push(
              ...krystalliumCubes.moveItems({
                type: LocationType.KrystalliumStock,
                player
              })
            )

            for (const cubeIndex of cubesOnCard.filter((item) => item.id !== Resource.Krystallium).getIndexes()) {
              const cube = this.material(MaterialType.ResourceCube).getItem(cubeIndex)
              consequences.push(
                this.material(MaterialType.ResourceCube).index(cubeIndex).moveItem({
                  type: LocationType.AvailableResources,
                  player,
                  id: cube.id as Resource
                })
              )
            }

            // Character tokens return to player
            for (const tokenIndex of this.getCharactersOnCard(cardIndex).getIndexes()) {
              const token = this.getCharactersOnCard(cardIndex).getItem(tokenIndex)
              consequences.push(
                this.material(MaterialType.CharacterToken).index(tokenIndex).moveItem({
                  type: LocationType.PlayerCharacters,
                  player,
                  id: token.id as Character
                })
              )
            }
          } else {
            // Old construction: recycling bonus goes to EmpireCardResources
            consequences.push(
              this.material(MaterialType.ResourceCube).createItem({
                id: details.recyclingBonus,
                location: {
                  type: LocationType.EmpireCardResources,
                  player
                }
              })
            )

            const cubesOnCard = this.getCubesOnCard(cardIndex)
            const krystalliumCubes = cubesOnCard.filter((item) => item.id === Resource.Krystallium)
            consequences.push(
              ...krystalliumCubes.moveItems({
                type: LocationType.KrystalliumStock,
                player
              })
            )

            const otherCubes = cubesOnCard.filter((item) => item.id !== Resource.Krystallium)
            consequences.push(...otherCubes.deleteItems())

            // Character tokens return to player
            for (const tokenIndex of this.getCharactersOnCard(cardIndex).getIndexes()) {
              const token = this.getCharactersOnCard(cardIndex).getItem(tokenIndex)
              consequences.push(
                this.material(MaterialType.CharacterToken).index(tokenIndex).moveItem({
                  type: LocationType.PlayerCharacters,
                  player,
                  id: token.id as Character
                })
              )
            }
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
    if ((isMoveItemType(MaterialType.ResourceCube)(move) || isMoveItemType(MaterialType.CharacterToken)(move))
      && move.location.type === LocationType.ConstructionCardCost) {
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
        const details = getDevelopmentDetails(development)
        if (details.constructionBonus) {
          for (const bonus of details.constructionBonus) {
            if (isCharacter(bonus)) {
              consequences.push(
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
              consequences.push(
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
      } else {
        // Card not complete yet - check if any available resources can no longer be placed
        consequences.push(...this.getUnplaceableResourceMoves(player))
      }
    }

    if (isMoveItemType(MaterialType.ResourceCube)(move)) {

      // Check if resource was placed on empire card
      if (move.location.type === LocationType.EmpireCardResources) {
        const player = move.location.player as Empire

        // Count non-krystallium cubes on empire card
        const empireResources = this.material(MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(player)

        const nonKrystalliumCubes = empireResources.filter((item) => item.id !== Resource.Krystallium)

        // If there are 5 or more non-krystallium cubes, transform 5 into 1 krystallium
        if (nonKrystalliumCubes.length >= 5) {
          // Delete 5 non-krystallium cubes at once
          const cubesToDelete = nonKrystalliumCubes.limit(5)
          consequences.push(cubesToDelete.deleteItemsAtOnce())

          // Create 1 krystallium in the krystallium stock
          consequences.push(
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

    // After a card move, check if any available resources can no longer be placed
    // Skip for cards moved to ConstructedDevelopments: beforeItemMove already handles cost payment
    if (isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type !== LocationType.ConstructedDevelopments) {
      const card = this.material(MaterialType.DevelopmentCard).getItem(move.itemIndex)
      const player = card.location.player as Empire | undefined

      if (player !== undefined) {
        consequences.push(...this.getUnplaceableResourceMoves(player))
      }
    }

    // After a resource is created in AvailableResources, check if it can be placed anywhere
    if (isCreateItem(move) && move.itemType === MaterialType.ResourceCube) {
      if (move.item.location?.type === LocationType.AvailableResources) {
        const player = move.item.location.player as Empire
        consequences.push(...this.getUnplaceableResourceMoves(player))
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
        // Resource cannot be placed anywhere, move each unit to empire card
        const quantity = resourceItem.quantity ?? 1
        for (let i = 0; i < quantity; i++) {
          moves.push(
            this.material(MaterialType.ResourceCube).index(resourceIndex).moveItem({
              type: LocationType.EmpireCardResources,
              player
            })
          )
        }
      }
    }

    return moves
  }

  /**
   * Check if a resource can be placed on any construction card (remaining slots)
   * or any draft card (all slots).
   */
  private canResourceBePlaced(player: Empire, resource: Resource): boolean {
    return this.canResourceBePlacedExcludingCard(player, resource, undefined)
  }

  /**
   * Check if a resource can be placed on any construction card (remaining slots)
   * or any draft card (all slots), excluding a specific card (e.g., the one being recycled).
   */
  private canResourceBePlacedExcludingCard(player: Empire, resource: Resource, excludeCardIndex: number | undefined): boolean {
    // Check construction area cards (remaining cost only)
    const constructionArea = this.material(MaterialType.DevelopmentCard).location(LocationType.ConstructionArea).player(player)

    for (const cardIndex of constructionArea.getIndexes()) {
      if (cardIndex === excludeCardIndex) continue

      const remainingCost = this.getRemainingCostForCard(cardIndex)

      // Check if resource can be placed on any remaining slot
      const canPlace = remainingCost.some(
        (cost) => (isResource(cost.item) && cost.item === resource) || (resource === Resource.Krystallium && isResource(cost.item))
      )

      if (canPlace) return true
    }

    // Check draft area cards (all cost slots)
    const draftArea = this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(player)

    for (const cardIndex of draftArea.getIndexes()) {
      if (cardIndex === excludeCardIndex) continue

      const card = this.material(MaterialType.DevelopmentCard).getItem(cardIndex)
      const development = card.id.front as Development
      const cost = getCost(development)

      // Check if resource can be placed on any slot
      const canPlace = cost.some((item) => (isResource(item) && item === resource) || (resource === Resource.Krystallium && isResource(item)))

      if (canPlace) return true
    }

    return false
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
