/** @jsxImportSource @emotion/react */
import { faHandBackFist } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { ItemContext, ItemMenuButton, MaterialContext, TokenDescription } from '@gamepark/react-game'
import { isCreateItem, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

// Import character token images
import Financier from '../images/characters/financier.jpg'
import General from '../images/characters/general.jpg'

/**
 * Character token description for the Material system
 * Tokens have a simple ID: Character enum value (Financier or General)
 */
export class CharacterTokenDescription extends TokenDescription<Empire, MaterialType, LocationType> {
  width = 2.5
  height = 2.5
  borderRadius = 1.25

  images = {
    [Character.Financier]: Financier,
    [Character.General]: General
  }

  /**
   * Return the stock location based on the character type.
   * Player-owned tokens go to PlayerCharacters, static stock uses CharacterStock.
   */
  getStockLocation(item: MaterialItem<Empire, LocationType>) {
    const character = item.id as Character
    return { type: LocationType.CharacterStock, id: character }
  }

  staticItems = [
    {
      id: Character.Financier,
      quantity: 5,
      location: { type: LocationType.CharacterStock, id: Character.Financier }
    },
    {
      id: Character.General,
      quantity: 5,
      location: { type: LocationType.CharacterStock, id: Character.General }
    }
  ]

  /**
   * Static items for character stockpiles displayed above the board.
   * One pile for Financier (left of science circle) and one for General (right).
   * Hidden during draft phase.
   */
  getStaticItems(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const ruleId = context.rules.game.rule?.id as RuleId | undefined
    const isDraftPhase = ruleId !== undefined && ruleId < RuleId.Planning
    return isDraftPhase ? [] : this.staticItems



  }

  /**
   * Menu button to choose a character when clicking on the stock pile.
   */
  getItemMenu(
    item: MaterialItem<Empire, LocationType>,
    context: ItemContext<Empire, MaterialType, LocationType>,
    legalMoves: MaterialMove<Empire, MaterialType, LocationType>[]
  ) {
    // Only show menu on static stock items (not player-owned tokens)
    if (item.location.type !== LocationType.CharacterStock || context.displayIndex !== 0 || item.location.player !== undefined) return null

    const character = item.id as Character

    // Find the createItem move for this character type
    const choiceMove = legalMoves.find(
      (move) =>
        isCreateItem(move) &&
        move.itemType === MaterialType.CharacterToken &&
        move.item.id === character
    )

    if (!choiceMove) return null

    return (
      <ItemMenuButton move={choiceMove} label={<Trans i18nKey="take" defaults="Take"/>} angle={0} radius={2}>
        <FontAwesomeIcon icon={faHandBackFist} />
      </ItemMenuButton>
    )
  }
}

export const characterTokenDescription = new CharacterTokenDescription()
