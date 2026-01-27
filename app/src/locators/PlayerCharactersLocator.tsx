/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { DeckLocator, DropAreaDescription, isItemContext, isLocationSubset, ItemContext, MaterialContext, useRules } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem, MaterialRules } from '@gamepark/rules-api'
import FinancierShadowed from '../images/characters/financier-shadowed.png'
import GeneralShadowed from '../images/characters/general-shadowed.png'
import { characterTokenDescription } from '../material/CharacterTokenDescription'
import { empireCardX, empireCardY, moveUpOffset, shouldMoveUpEmpire } from './EmpireCardSpaceLocator'

const shadowedImages: Record<number, string> = {
  [Character.Financier]: FinancierShadowed,
  [Character.General]: GeneralShadowed
}

/**
 * Content component for character token locations.
 * Shows a shadowed placeholder when the player has 0 tokens (like v2),
 * and a count overlay when > 1 token.
 */
const CharacterLocationContent = ({ location }: { location: Location }) => {
  const rules = useRules<MaterialRules>()!
  const count = rules
    .material(MaterialType.CharacterToken)
    .location((l) => isLocationSubset(l, location))
    .getQuantity()
  const character = location.id as Character

  return (
    <>
      {count === 0 && <img alt="" src={shadowedImages[character]} css={placeholderStyle} />}
      <span>{count}</span>
    </>
  )
}

const placeholderStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
`

class PlayerCharactersLocationDescription extends DropAreaDescription {
  content = CharacterLocationContent

  extraCss = css`
    pointer-events: none;

    > span {
      position: absolute;
      top: 0.2em;
      left: 0.1em;
      font-size: 1.5em;
      font-weight: bolder;
      color: white;
      opacity: 0.8;
      text-shadow:
        2px 2px 0 #000,
        -2px 2px 0 #000,
        -2px -2px 0 #000,
        2px -2px 0 #000;
    }
  `
}

class PlayerCharactersLocator extends DeckLocator<Empire, MaterialType, LocationType> {
  locationDescription = new PlayerCharactersLocationDescription(characterTokenDescription)

  getLocations(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    if (currentView === undefined) return []
    return [
      { type: LocationType.PlayerCharacters, player: currentView, id: Character.Financier },
      { type: LocationType.PlayerCharacters, player: currentView, id: Character.General }
    ]
  }

  hide(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>) {
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]
    return item.location.player !== currentView
  }

  getCoordinates(location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>): Coordinates {
    const character = location.id as Character
    const x = character === Character.Financier ? empireCardX - 2 : empireCardX + 2
    const baseY = empireCardY + 5
    const y = shouldMoveUpEmpire(context) ? baseY - moveUpOffset : baseY
    return { x, y, z: isItemContext(context) ? 0 : 5 }
  }
}

export const playerCharactersLocator = new PlayerCharactersLocator()
