import { MaterialGameSetup } from '@gamepark/rules-api'
import { Empire } from './Empire'
import { Memory } from './ItsAWonderfulWorldMemory'
import { ItsAWonderfulWorldOptions } from './ItsAWonderfulWorldOptions'
import { ItsAWonderfulWorldRules } from './ItsAWonderfulWorldRules'
import { DeckType } from './material/DeckType'
import { Development, ascensionDevelopmentCardIds, baseDevelopmentCardIds, getDevelopmentDetails } from './material/Development'
import { Empires } from './material/Empires'
import { EmpireSide } from './material/EmpireSide'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Resource } from './material/Resource'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class ItsAWonderfulWorldSetup extends MaterialGameSetup<Empire, MaterialType, LocationType, ItsAWonderfulWorldOptions> {
  Rules = ItsAWonderfulWorldRules

  setupMaterial(options: ItsAWonderfulWorldOptions) {
    // Initialize game memory
    this.memorize(Memory.Round, 1)

    // Memorize the empire side used in this game (static, same for all players)
    const empireSide = options.empiresSide ?? EmpireSide.A
    this.memorize(Memory.EmpireSide, empireSide)

    // Create the base development card deck
    // Cards have a composite ID: {front: Development, back: DeckType}
    // Each Development enum value may have multiple copies (numberOfCopies)
    this.material(MaterialType.DevelopmentCard).createItems(
      baseDevelopmentCardIds.flatMap((devId) => {
        const copies = getDevelopmentDetails(devId as Development).numberOfCopies || 1
        return Array.from({ length: copies }, () => ({
          id: { front: devId, back: DeckType.Default },
          location: { type: LocationType.Deck }
        }))
      })
    )

    // Shuffle the deck using the framework's shuffle method
    this.material(MaterialType.DevelopmentCard).location(LocationType.Deck).shuffle()

    // Create the Ascension deck if the expansion is enabled
    // Ascension cards have a different back image
    if (options.corruptionAndAscension) {
      this.material(MaterialType.DevelopmentCard).createItems(
        ascensionDevelopmentCardIds.flatMap((devId) => {
          const copies = getDevelopmentDetails(devId as Development).numberOfCopies || 1
          return Array.from({ length: copies }, () => ({
            id: { front: devId, back: DeckType.Ascension },
            location: { type: LocationType.AscensionDeck }
          }))
        })
      )

      // Shuffle the Ascension deck
      this.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).shuffle()
    }

    // Setup each player's initial resources
    // Empire cards are static items (displayed via getStaticItems in MaterialDescription)
    options.players.forEach((player) => {
      const empire = player.id

      // Add initial Krystallium to the empire card if the empire has any
      const krystallium = Empires[empire][empireSide].krystallium ?? 0
      for (let i = 0; i < krystallium; i++) {
        this.material(MaterialType.ResourceCube).createItem({
          id: Resource.Krystallium,
          location: { type: LocationType.KrystalliumStock, player: empire }
        })
      }
    })

    // Character tokens are in an infinite stock (CharacterStock)
    // They will be created dynamically when needed with createItem()
  }

  start() {
    // Start the game by dealing development cards to all players
    this.startRule(RuleId.DealDevelopmentCards)
  }
}
