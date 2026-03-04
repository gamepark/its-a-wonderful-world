/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Character, isCharacter } from '@gamepark/its-a-wonderful-world/material/Character'
import { Development, getConstructionSpaceLocation, getCost, getRemainingCost } from '@gamepark/its-a-wonderful-world/material/Development'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { isResource, Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { MaterialHelpProps, Picture, useLegalMoves, usePlay, usePlayerId, useRules, useUndo } from '@gamepark/react-game'
import { isMoveItem, isMoveItemType, MaterialMove, MaterialRules, MoveItem } from '@gamepark/rules-api'
import { Fragment } from 'react'
import buttonArrow from '../images/button-arrow.png'
import EnergyCube from '../images/resources/energy-cube.png'
import ExplorationCube from '../images/resources/exploration-cube.png'
import GoldCube from '../images/resources/gold-cube.png'
import KrystalliumCube from '../images/resources/krytallium-cube.png'

// Cube images
import MaterialsCube from '../images/resources/materials-cube.png'
import ScienceCube from '../images/resources/science-cube.png'
import { characterIcons } from '../panels/Images'

const cubeImages: Record<Resource, string> = {
  [Resource.Materials]: MaterialsCube,
  [Resource.Energy]: EnergyCube,
  [Resource.Science]: ScienceCube,
  [Resource.Gold]: GoldCube,
  [Resource.Exploration]: ExplorationCube,
  [Resource.Krystallium]: KrystalliumCube
}

// Card dimensions matching ConstructionCardCostLocator
const cardWidth = 6.5
const cardHeight = 10

// Cost space positioning constants matching ConstructionCardCostLocator
const costSpaceDeltaX = 0.2
const costSpaceDeltaX2 = 1.4
const costSpaceDeltaY = (column: number, index: number) => index * 0.93 + (column === 1 ? 0.2 : 1.6)

export function ConstructionButtons({ item, itemIndex }: MaterialHelpProps) {
  const playerId = usePlayerId()
  const rules = useRules<MaterialRules>()!
  const legalMoves = useLegalMoves()
  const play = usePlay()
  const [undo, canUndo] = useUndo<MaterialMove>()

  if (itemIndex === undefined) return null
  if (item.location?.type !== LocationType.ConstructionArea) return null

  const id = item.id as { front?: Development } | undefined
  if (!id?.front) return null
  const development = id.front

  // Get the cost and figure out which spaces are filled
  const cost = getCost(development)
  const filledSpaces: (Resource | Character | undefined)[] = Array(cost.length).fill(undefined)
  const cubes = rules.material(MaterialType.ResourceCube).location(LocationType.ConstructionCardCost).parent(itemIndex).getItems()
  for (const cube of cubes) {
    filledSpaces[cube.location.x ?? 0] = cube.id as Resource
  }
  for (const token of rules.material(MaterialType.CharacterToken).location(LocationType.ConstructionCardCost).parent(itemIndex).getItems()) {
    filledSpaces[token.location.x ?? 0] = token.id as Character
  }

  // Render placed items on the card, with undo capability for krystallium and character tokens
  const isMyCard = item.location?.player === playerId
  const placedItems: { space: number; icon: string; isRound: boolean; undoable: boolean }[] = []
  for (let space = 0; space < filledSpaces.length; space++) {
    const placed = filledSpaces[space]
    if (placed === undefined) continue
    const isUndoable = isMyCard && (isCharacter(placed) || placed === Resource.Krystallium) && canUndo(move =>
      isMoveItem(move) && move.location.type === LocationType.ConstructionCardCost && move.location.parent === itemIndex && move.location.x === space
    )
    if (isCharacter(placed)) {
      placedItems.push({ space, icon: characterIcons[placed], isRound: true, undoable: isUndoable })
    } else {
      placedItems.push({ space, icon: cubeImages[placed], isRound: false, undoable: isUndoable })
    }
  }

  // Buttons: only for current player's card with legal moves
  const remainingCost = getRemainingCost(development, filledSpaces)

  const placeMoves = isMyCard ? legalMoves.filter((move): move is MoveItem =>
    (isMoveItemType(MaterialType.ResourceCube)(move) || isMoveItemType(MaterialType.CharacterToken)(move)) &&
    (move as MoveItem).location?.type === LocationType.ConstructionCardCost &&
    (move as MoveItem).location?.parent === itemIndex
  ) : []

  const buttons = placeMoves.length > 0 && remainingCost.length > 0
    ? getSmartPlaceMoves(development, remainingCost, placeMoves, rules)
    : []

  return (
    <div css={extraContentWrapper}>
      {placedItems.map(({ space, icon, isRound, undoable }) => {
        const { column, index } = getConstructionSpaceLocation(development, space)
        const pos = getPlacedItemPosition(column, index)
        if (undoable) {
          const buttonPos = getButtonPosition(column, index)
          const arrowCss = column === 1 ? leftArrowCss : rightArrowCss
          return (
            <Fragment key={`undo-${space}`}>
              <div css={[placedItemStyle, pos]}>
                <Picture src={icon} css={isRound ? placedRoundStyle : placedCubeStyle} />
              </div>
              <button
                css={[buttonStyle, buttonPos, arrowCss]}
                onClick={() => undo(move =>
                  isMoveItem(move) && move.location.type === LocationType.ConstructionCardCost && move.location.parent === itemIndex && move.location.x === space
                )}
              >
                <Picture src={icon} css={isRound ? roundIconStyle : iconStyle} />
              </button>
            </Fragment>
          )
        }
        return (
          <div key={`placed-${space}`} css={[placedItemStyle, pos]}>
            <Picture src={icon} css={isRound ? placedRoundStyle : placedCubeStyle} />
          </div>
        )
      })}
      {buttons.map(({ space, move, icon, isRound }) => {
        const { column, index } = getConstructionSpaceLocation(development, space)
        const pos = getButtonPosition(column, index)
        const arrowCss = column === 1 ? rightArrowCss : leftArrowCss
        return (
          <button
            key={space}
            css={[buttonStyle, pos, arrowCss]}
            onClick={() => play(move)}
          >
            <Picture src={icon} css={isRound ? roundIconStyle : iconStyle} />
          </button>
        )
      })}
    </div>
  )
}

type ButtonInfo = { space: number; move: MaterialMove; icon: string; isRound: boolean }

function getSmartPlaceMoves(
  _development: Development,
  remainingCost: { item: Resource | Character; space: number }[],
  placeMoves: MoveItem[],
  rules: MaterialRules
): ButtonInfo[] {
  const buttons: ButtonInfo[] = []

  // Count available resources and characters from legal moves (each unique itemIndex counted once)
  const availableResources: Record<number, number> = {}
  const availableKrystallium: { index: number; remaining: number }[] = []
  const availableCharacters: Record<number, number> = {}

  for (const move of placeMoves) {
    const moveItem = rules.material(move.itemType).getItem(move.itemIndex)
    const id = moveItem.id
    if (move.itemType === MaterialType.ResourceCube) {
      if (id === Resource.Krystallium) {
        if (!availableKrystallium.some(k => k.index === move.itemIndex)) {
          availableKrystallium.push({ index: move.itemIndex, remaining: moveItem.quantity ?? 1 })
        }
      } else {
        if (availableResources[move.itemIndex] === undefined) {
          availableResources[move.itemIndex] = moveItem.quantity ?? 1
        }
      }
    } else if (move.itemType === MaterialType.CharacterToken) {
      if (availableCharacters[move.itemIndex] === undefined) {
        availableCharacters[move.itemIndex] = moveItem.quantity ?? 1
      }
    }
  }

  // Build a map: resource type -> list of available item indexes with remaining quantities
  const resourcePool: Record<number, { index: number; remaining: number }[]> = {}
  for (const [indexStr, qty] of Object.entries(availableResources)) {
    const index = Number(indexStr)
    const resource = rules.material(MaterialType.ResourceCube).getItem(index).id as Resource
    if (!resourcePool[resource]) resourcePool[resource] = []
    resourcePool[resource].push({ index, remaining: qty })
  }

  const characterPool: Record<number, { index: number; remaining: number }[]> = {}
  for (const [indexStr, qty] of Object.entries(availableCharacters)) {
    const index = Number(indexStr)
    const character = rules.material(MaterialType.CharacterToken).getItem(index).id as Character
    if (!characterPool[character]) characterPool[character] = []
    characterPool[character].push({ index, remaining: qty })
  }

  const findMoveForSpace = (space: number, itemType: number, itemIndex: number) =>
    placeMoves.find(m => m.itemType === itemType && m.itemIndex === itemIndex && m.location.x === space)

  const consumeFromPool = (pool: { index: number; remaining: number }[]): number | undefined => {
    while (pool.length > 0) {
      if (pool[0].remaining > 0) {
        pool[0].remaining--
        return pool[0].index
      }
      pool.shift()
    }
    return undefined
  }

  for (const { item, space } of remainingCost) {
    if (isResource(item)) {
      // Try exact resource match first, then krystallium
      const pool = item !== Resource.Krystallium ? resourcePool[item] : undefined
      const exactIndex = pool ? consumeFromPool(pool) : undefined
      if (exactIndex !== undefined) {
        const move = findMoveForSpace(space, MaterialType.ResourceCube, exactIndex)
        if (move) {
          buttons.push({ space, move, icon: cubeImages[item], isRound: false })
          continue
        }
      }
      const kIndex = availableKrystallium.length > 0 ? availableKrystallium[0].index : undefined
      if (kIndex !== undefined) {
        const move = findMoveForSpace(space, MaterialType.ResourceCube, kIndex)
        if (move) {
          buttons.push({ space, move, icon: cubeImages[Resource.Krystallium], isRound: false })
        }
      }
    } else if (isCharacter(item)) {
      const pool = characterPool[item]
      const charIndex = pool ? consumeFromPool(pool) : undefined
      if (charIndex !== undefined) {
        const move = findMoveForSpace(space, MaterialType.CharacterToken, charIndex)
        if (move) {
          buttons.push({ space, move, icon: characterIcons[item], isRound: true })
        }
      }
    }
  }

  return buttons
}

function getPlacedItemPosition(column: number, index: number) {
  const x = ((column === 1 ? costSpaceDeltaX : costSpaceDeltaX2) * 100) / cardWidth
  const y = (costSpaceDeltaY(column, index) * 100) / cardHeight
  return css`
    left: ${x}%;
    top: ${y}%;
  `
}

function getButtonPosition(column: number, index: number) {
  const y = (costSpaceDeltaY(column, index) * 100) / cardHeight

  if (column === 1) {
    return css`
      right: ${100 + 7}%;
      top: ${y}%;
    `
  } else {
    return css`
      left: ${(costSpaceDeltaX2 * 100) / 6.5 + (1.4 * 100) / 6.5}%;
      top: ${y}%;
    `
  }
}

const buttonStyle = css`
  position: absolute;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  background-color: transparent;
  border: 0;
  padding: 0.3%;
  cursor: pointer;
  filter: drop-shadow(0.1em 0.1em 0.5em black);

  &:hover, &:focus {
    outline: 0;
    transform: translateY(1px) scale(1.1);
    cursor: pointer;
  }

  &:active {
    transform: translateY(1px);
  }
`

const rightArrowCss = css`
  &:after {
    background-image: url(${buttonArrow});
    width: 3em;
    height: 3em;
    content: '';
    right: -3em;
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
  }
`

const leftArrowCss = css`
  &:before {
    background-image: url(${buttonArrow});
    width: 3em;
    height: 3em;
    content: '';
    left: -3em;
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
    transform: scaleX(-1);
  }
`

const iconStyle = css`
  width: 6.5em;
  height: 6.5em;
  object-fit: contain;
`

const roundIconStyle = css`
  width: 6.5em;
  height: 6.5em;
  border-radius: 50%;
  object-fit: cover;
`

const extraContentWrapper = css`
  position: absolute;
  inset: 0;
  z-index: 10;
  transform: translateZ(1px);
`

const placedItemStyle = css`
  position: absolute;
  z-index: 5;
  pointer-events: none;
`

const placedCubeStyle = css`
  width: 6.5em;
  height: 6.5em;
  object-fit: contain;
`

const placedRoundStyle = css`
  width: 6.5em;
  height: 6.5em;
  border-radius: 50%;
  object-fit: cover;
`
