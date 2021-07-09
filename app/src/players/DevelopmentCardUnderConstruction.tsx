/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {getLegalMoves, getMovesToBuild, getRemainingCost, isPlaceItemOnCard, placeAvailableCubesMoves} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import Character, {isCharacter} from '@gamepark/its-a-wonderful-world/material/Character'
import Construction from '@gamepark/its-a-wonderful-world/material/Construction'
import Development from '@gamepark/its-a-wonderful-world/material/Development'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Resource, {isResource} from '@gamepark/its-a-wonderful-world/material/Resource'
import CompleteConstruction, {isCompleteConstruction} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import MoveType from '@gamepark/its-a-wonderful-world/moves/MoveType'
import MoveView from '@gamepark/its-a-wonderful-world/moves/MoveView'
import PlaceCharacter, {isPlaceCharacter, placeCharacterMove} from '@gamepark/its-a-wonderful-world/moves/PlaceCharacter'
import PlaceResource, {
  isPlaceResourceOnConstruction, PlaceResourceOnConstruction, placeResourceOnConstructionMove
} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import Recycle, {isRecycle} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import SlateForConstruction, {slateForConstructionMove} from '@gamepark/its-a-wonderful-world/moves/SlateForConstruction'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useActions, useAnimations, usePlay, usePlayerId, useUndo} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {DragAroundProps} from '@gamepark/react-components/dist/Draggable/DragAround'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import CharacterToken from '../material/characters/CharacterToken'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import DragItemType from '../material/DragItemType'
import ResourceCube, {cubeHeight, cubeWidth} from '../material/resources/ResourceCube'
import {areaCardStyle, cardHeight, cardStyle, cardWidth, glow} from '../util/Styles'
import {useLongPress} from '../util/useLongPress'

type Props = {
  game: GameView
  gameOver: boolean
  player: Player | PlayerView
  construction: Construction
  canRecycle: boolean
  focused: boolean
  setFocus: () => void
} & Omit<DragAroundProps, 'dragging'>

type DropItem = { resource: Resource } & { character: Character }

export default function DevelopmentCardUnderConstruction({game, gameOver, player, construction, canRecycle, focused, setFocus, ...props}: Props) {
  const playerId = usePlayerId<EmpireName>()
  const play = usePlay()
  const legalMoves = isPlayer(player) ? getLegalMoves(player, game.phase) : []
  const [undo, canUndo] = useUndo()
  const longPress = useLongPress({
    onClick: () => setFocus(),
    onLongPress: () => {
      if (player.empire !== playerId) {
        return
      }
      placeAvailableCubesMoves(player, construction).forEach(move => play(move))
      if (window.navigator.vibrate) {
        window.navigator.vibrate(200)
      }
    }
  })
  const actions = useActions<MoveView, EmpireName>()
  const placeResourceMoves: PlaceResourceOnConstruction[] = legalMoves.filter(isPlaceResourceOnConstruction)
    .filter(move => move.card === construction.card)
  const placeCharacterMoves: PlaceCharacter[] = legalMoves.filter(isPlaceCharacter).filter(move => move.card === construction.card)
  const [{canDrop, isOver}, ref] = useDrop({
    accept: [DragItemType.RESOURCE_FROM_BOARD, DragItemType.KRYSTALLIUM_FROM_EMPIRE, DragItemType.CHARACTER_TOKEN_FROM_EMPIRE],
    canDrop: (item: DropItem, monitor: DropTargetMonitor) => {
      switch (monitor.getItemType()) {
        case DragItemType.RESOURCE_FROM_BOARD:
          return placeResourceMoves.some(move => move.resource === item.resource)
        case DragItemType.KRYSTALLIUM_FROM_EMPIRE:
          return placeResourceMoves.length > 0
        case DragItemType.CHARACTER_TOKEN_FROM_EMPIRE:
          return placeCharacterMoves.some(move => move.character === item.character)
        default:
          return false
      }
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: DropItem, monitor: DropTargetMonitor) => {
      switch (monitor.getItemType()) {
        case DragItemType.RESOURCE_FROM_BOARD:
          const firstSpace = Math.min(...placeResourceMoves.filter(move => move.resource === item.resource).map(move => move.space))
          play(placeResourceOnConstructionMove(playerId!, item.resource, construction.card, firstSpace))
          break
        case DragItemType.KRYSTALLIUM_FROM_EMPIRE:
          const remainingCost = getRemainingCost(construction)
          const krystalliumCost = remainingCost.find(cost => cost.item === Resource.Krystallium)
          if (krystalliumCost) {
            play(placeResourceOnConstructionMove(playerId!, Resource.Krystallium, construction.card, krystalliumCost.space))
          } else {
            const remainingResourcesRequired = new Set(remainingCost.filter(cost => isResource(cost.item)).map(cost => cost.item))
            if (remainingResourcesRequired.size === 1) {
              play(placeResourceOnConstructionMove(playerId!, Resource.Krystallium, construction.card, Math.min(...placeResourceMoves.map(move => move.space))))
            } else {
              setFocus()
            }
          }
          break
        case DragItemType.CHARACTER_TOKEN_FROM_EMPIRE:
          play(placeCharacterMove(playerId!, item.character, construction.card, Math.min(...placeCharacterMoves.map(move => move.space))))
          break
      }
    }
  })
  const animations = useAnimations<PlaceResourceOnConstruction>(animation => animation.move.type === MoveType.PlaceResource && animation.move.playerId === player.empire
    && isPlaceResourceOnConstruction(animation.move) && animation.move.card === construction.card)

  const drop = (move: Recycle | CompleteConstruction | SlateForConstruction) => {
    if (isRecycle(move)) {
      construction.costSpaces.forEach((item, index) => {
        if (!item) return
        const move: PlaceResource | PlaceCharacter = isResource(item) ?
          placeResourceOnConstructionMove(player.empire, item, construction.card, index) :
          placeCharacterMove(player.empire, item, construction.card, index)
        if (canUndo(move)) {
          undo(move)
        }
      })
      if (canUndo(slateForConstructionMove(player.empire, construction.card))) {
        undo(slateForConstructionMove(player.empire, construction.card))
      }
      play(move)
    } else if (isCompleteConstruction(move)) {
      getMovesToBuild(player as Player, construction.card).forEach(move => play(move))
    } else {
      // First undo the item placed on the card if any
      const placeItemsOnCard = actions!.filter(action => action.playerId === player.empire && isPlaceItemOnCard(action.move, construction.card))
      placeItemsOnCard.map(action => action.move).reverse().forEach(move => undo(move))
      undo(move)
    }
  }

  return (
    <Draggable type={DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA} item={{card: construction.card}} canDrag={!gameOver && canRecycle && !canDrop && !focused}
               css={[cardStyle, areaCardStyle]} drop={drop} {...longPress} {...props}>
      <div ref={ref} css={getInnerStyle(canDrop, isOver)}>
        <DevelopmentCard development={developmentCards[construction.card]} css={css`height: 100%;`}/>
        {[...construction.costSpaces].reverse().map((item, index) => {
          const space = construction.costSpaces.length - index
          if (isResource(item)) {
            return <ResourceCube key={index} resource={item} css={getResourceStyle(construction, space - 1)}/>
          } else if (isCharacter(item)) {
            return <CharacterToken key={index} character={item} css={getCharacterTokenStyle(construction, space - 1)}/>
          } else if (animations.find(animation => animation.move.space === space)) {
            return <ResourceCube key={index} resource={item} css={[getResourceStyle(construction, space - 1), css`opacity: 0;`]}/>
          } else {
            return null
          }
        })}
      </div>
    </Draggable>
  )
}

const getInnerStyle = (canDrop: boolean, isOver: boolean) => css`
  border-radius: 5%;
  width: 100%;
  height: 100%;
  ${canDrop && canDropStyle};
  ${canDrop && isOver && overStyle};
`

const canDropStyle = css`
  transition: transform 0.2s ease-in-out !important;
  animation: ${glow('#f7a600')} 1s ease-in-out infinite alternate;
  transform: scale(1.05);
`

const overStyle = css`
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(247, 166, 0, 0.3);
  }
`

export const costSpaceDeltaX = 0.22
export const costSpaceDeltaX2 = 1.8
export const costSpaceDeltaY = (column: number, index: number) => index * 2.12 + (column === 1 ? 0.4 : 3.6)

const getResourceStyle = (construction: Construction, space: number) => {
  const {column, index} = getConstructionSpaceLocation(construction, space)
  return css`
    position: absolute;
    width: ${cubeWidth * 100 / cardWidth};
    height: ${cubeHeight * 100 / cardHeight}%;
    left: ${(column === 1 ? costSpaceDeltaX : costSpaceDeltaX2) * 100 / cardWidth}%;
    top: ${costSpaceDeltaY(column, index) * 100 / cardHeight}%;
  `
}

const getCharacterTokenStyle = (construction: Construction, space: number) => {
  const {column, index} = getConstructionSpaceLocation(construction, space)
  return css`
    position: absolute;
    height: 10%;
    left: ${(column === 1 ? costSpaceDeltaX : costSpaceDeltaX2) * 100 / cardWidth}%;
    top: ${costSpaceDeltaY(column, index) * 100 / cardHeight}%;
  `
}

export function getConstructionSpaceLocation(construction: Construction, space: number): { column: number, index: number } {
  const column2Pattern = getDevelopmentColumn2Pattern(construction)
  if (column2Pattern.length) {
    return getSpaceLocation(space, column2Pattern)
  } else {
    return {column: 1, index: space}
  }
}

export function getDevelopmentColumn2Pattern(construction: Construction): number[] {
  switch (developmentCards[construction.card]) {
    case Development.AlphaCentauri:
      return [4, 5, 11, 12, 13]
    case Development.Hyperborea:
      return [7, 8]
    case Development.CelestialCathedral:
      return [3, 8]
    case Development.TheWall:
      return [6, 7, 8, 11, 12, 14]
    case Development.WorldBank:
      return [5, 6, 10, 11]
    case Development.ArtificialSun:
      return [3, 8, 9, 10, 12]
    case Development.DarkMatter:
      return [4, 8, 9]
    case Development.Immortality:
      return [7, 8, 9, 10]
    case Development.Utopia:
      return [3, 5, 7]
    case Development.GiantRobot:
      return [6, 7]
    default:
      return []
  }
}

function getSpaceLocation(space: number, column2Pattern: number[]) {
  const column = column2Pattern.includes(space) ? 2 : 1
  return {column, index: column === 1 ? space - column2Pattern.filter(s => s < space).length : column2Pattern.indexOf(space)}
}