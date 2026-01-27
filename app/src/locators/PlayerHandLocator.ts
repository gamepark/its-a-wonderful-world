import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'

export class PlayerHandLocator extends HandLocator<Empire, MaterialType, LocationType> {
  /**
   * Get the current view player (the player whose perspective is being shown)
   */
  private getCurrentView(context: ItemContext<Empire, MaterialType, LocationType>): Empire | undefined {
    return context.rules.game.view ?? context.player ?? context.rules.players[0]
  }

  /**
   * Hand X position depends on number of players and Ascension expansion (from v2 handX).
   * Centers the hand in the available horizontal space, accounting for player panels on the right.
   */
  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const players = context.rules.players.length
    const hasAscension = context.rules.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).length > 0

    let x: number
    if ((!hasAscension && players > 2) || players > 4) {
      x = 0         // Many panels on the right, hand shifted left
    } else if ((!hasAscension && players === 2) || players === 3) {
      x = 8          // Few/no panels, hand shifted right
    } else if (players === 2) {
      x = 4          // Ascension + 2 players, hand centered
    } else {
      x = -4         // Ascension + 4 players, hand shifted left for panels
    }

    return { x, y: 15.7, z: 10 }
  }

  radius = 500
  gapMaxAngle = 0.72

  /**
   * Max angle depends on number of players and whether Ascension expansion is used (from v2 handMaxAngle)
   */
  getMaxAngle(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>): number {
    const players = context.rules.players.length
    const hasAscension = context.rules.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).length > 0

    if ((!hasAscension && players > 2) || players === 7) {
      return 5
    } else if ((!hasAscension && players === 2) || players === 3) {
      return 6.9
    } else if (players === 2) {
      return 7.9
    } else {
      return 6
    }
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): boolean {
    const currentView = this.getCurrentView(context)
    return item.location.player !== currentView
  }

  getHoverTransform(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): string[] {
    return ['translateZ(10em)', 'translateY(-5em)', `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }
}

export const playerHandLocator = new PlayerHandLocator()
