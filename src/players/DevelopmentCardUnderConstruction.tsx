import {css} from '@emotion/core'
import {Draggable, useActions, useAnimations, usePlay, usePlayerId, useUndo} from '@interlude-games/workshop'
import {DragAroundProps} from '@interlude-games/workshop/dist/Draggable/DragAround'
import React, {FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import CharacterTokenFromEmpire from '../drag-objects/CharacterTokenFromEmpire'
import {developmentFromConstructionArea} from '../drag-objects/DevelopmentFromConstructionArea'
import DragObjectType from '../drag-objects/DragObjectType'
import KrystalliumFromEmpire from '../drag-objects/KrystalliumCube'
import ResourceFromBoard from '../drag-objects/ResourceFromBoard'
import {isCharacter} from '../material/characters/Character'
import CharacterToken from '../material/characters/CharacterToken'
import Construction from '../material/developments/Construction'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import EmpireName from '../material/empires/EmpireName'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth} from '../material/resources/ResourceCube'
import CompleteConstruction, {isCompleteConstruction} from '../moves/CompleteConstruction'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import PlaceCharacter, {isPlaceCharacter, placeCharacter} from '../moves/PlaceCharacter'
import {isPlaceResourceOnConstruction, placeResource, PlaceResourceOnConstruction} from '../moves/PlaceResource'
import Recycle, {isRecycle} from '../moves/Recycle'
import SlateForConstruction, {slateForConstruction} from '../moves/SlateForConstruction'
import ItsAWonderfulWorldRules, {canUndoSlateForConstruction, getLegalMoves, getMovesToBuild, getRemainingCost, isPlaceItemOnCard} from '../Rules'
import GameView from '../types/GameView'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import {areaCardStyle, cardHeight, cardStyle, cardWidth, glow} from '../util/Styles'
import {useLongPress} from '../util/useLongPress'

type Props = {
  game: GameView
  player: Player | PlayerView
  construction: Construction
  canRecycle: boolean
  focused: boolean
  setFocus: () => void
} & Omit<DragAroundProps, 'dragging'>

const DevelopmentCardUnderConstruction: FunctionComponent<Props> = ({game, player, construction, canRecycle, focused, setFocus, ...props}) => {
  const playerId = usePlayerId<EmpireName>()
  const play = usePlay()
  const legalMoves = isPlayer(player) ? getLegalMoves(player, game.phase) : []
  const [undo] = useUndo(ItsAWonderfulWorldRules)
  const longPress = useLongPress({
    onClick: () => setFocus(),
    onLongPress: () => {
      const availableResource = JSON.parse(JSON.stringify(player.availableResources)) as Resource[]
      getRemainingCost(construction).forEach(cost => {
        if (isResource(cost.item)) {
          if (availableResource.some(resource => resource === cost.item)) {
            play(placeResource(player.empire, cost.item, construction.card, cost.space))
            availableResource.splice(availableResource.findIndex(resource => resource === cost.item), 1)
          }
        }
      })
      window.navigator.vibrate(200)
    }
  })
  const actions = useActions<Move, EmpireName>()
  const placeResourceMoves: PlaceResourceOnConstruction[] = legalMoves.filter(isPlaceResourceOnConstruction)
    .filter(move => move.card === construction.card)
  const placeCharacterMoves: PlaceCharacter[] = legalMoves.filter(isPlaceCharacter).filter(move => move.card === construction.card)
  const [{canDrop, isOver}, ref] = useDrop({
    accept: [DragObjectType.RESOURCE_FROM_BOARD, DragObjectType.KRYSTALLIUM_FROM_EMPIRE, DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE],
    canDrop: (item: ResourceFromBoard | KrystalliumFromEmpire | CharacterTokenFromEmpire) => {
      switch (item.type) {
        case DragObjectType.RESOURCE_FROM_BOARD:
          return placeResourceMoves.some(move => move.resource === item.resource)
        case DragObjectType.KRYSTALLIUM_FROM_EMPIRE:
          return placeResourceMoves.length > 0
        case DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE:
          return placeCharacterMoves.some(move => move.character === item.character)
      }
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard | KrystalliumFromEmpire | CharacterTokenFromEmpire) => {
      switch (item.type) {
        case DragObjectType.RESOURCE_FROM_BOARD:
          play(placeResource(playerId!, item.resource, construction.card, Math.min(...placeResourceMoves.filter(move => move.resource === item.resource).map(move => move.space))))
          break
        case DragObjectType.KRYSTALLIUM_FROM_EMPIRE:
          const remainingCost = getRemainingCost(construction)
          const krystalliumCost = remainingCost.find(cost => cost.item === Resource.Krystallium)
          if (krystalliumCost) {
            play(placeResource(playerId!, Resource.Krystallium, construction.card, krystalliumCost.space))
          } else {
            const remainingResourcesRequired = new Set(remainingCost.filter(cost => isResource(cost.item)).map(cost => cost.item))
            if (remainingResourcesRequired.size === 1) {
              play(placeResource(playerId!, Resource.Krystallium, construction.card, Math.min(...placeResourceMoves.map(move => move.space))))
            } else {
              setFocus()
            }
          }
          break
        case DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE:
          play(placeCharacter(playerId!, item.character, construction.card, Math.min(...placeCharacterMoves.map(move => move.space))))
          break
      }
    }
  })
  const animations = useAnimations<PlaceResourceOnConstruction>(animation => animation.move.type === MoveType.PlaceResource && animation.move.playerId === player.empire
    && isPlaceResourceOnConstruction(animation.move) && animation.move.card === construction.card)

  const onDrop = (move: Recycle | CompleteConstruction | SlateForConstruction) => {
    if (isRecycle(move)) {
      if (actions && canUndoSlateForConstruction(actions, player.empire, construction.card)) {
        const placeItemsOnCard = actions!.filter(action => action.playerId === player.empire && isPlaceItemOnCard(action.move, construction.card))
        placeItemsOnCard.map(action => action.move).reverse().forEach(undo)
        undo(slateForConstruction(player.empire, construction.card))
      }
      play(move)
    } else if (isCompleteConstruction(move)) {
      getMovesToBuild(player as Player, construction.card).forEach(move => play(move))
    } else {
      // First undo the item placed on the card if any
      const placeItemsOnCard = actions!.filter(action => action.playerId === player.empire && isPlaceItemOnCard(action.move, construction.card))
      placeItemsOnCard.map(action => action.move).reverse().forEach(undo)
      undo(move)
    }
  }

  return (
    <Draggable item={developmentFromConstructionArea(construction.card)} disabled={!canRecycle || canDrop || focused} css={[cardStyle, areaCardStyle]}
               onDrop={onDrop} {...longPress} {...props}>
      <div ref={ref} css={getInnerStyle(canDrop, isOver)}>
        <DevelopmentCard development={developmentCards[construction.card]} css={css`height: 100%;`}/>
        {[...construction.costSpaces].reverse().map((item, index) => {
          const space = construction.costSpaces.length - index
          if (isResource(item)) {
            return <ResourceCube key={index} resource={item} css={getResourceStyle(space - 1)}/>
          } else if (isCharacter(item)) {
            return <CharacterToken key={index} character={item} css={getCharacterTokenStyle(space - 1)}/>
          } else if (animations.find(animation => animation.move.space === space)) {
            return <ResourceCube key={index} resource={item} css={[getResourceStyle(space - 1), css`opacity: 0;`]}/>
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
  animation: ${glow('green')} 1s ease-in-out infinite alternate;
  transform: scale(1.05);
`

const overStyle = css`
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 128, 0, 0.3);
  }
`

export const costSpaceDeltaX = 0.25
export const costSpaceDeltaY = (index: number) => index * 2.1 + 0.3

const getResourceStyle = (index: number) => css`
  position: absolute;
  width: ${cubeWidth * 100 / cardWidth};
  height: ${cubeHeight * 100 / cardHeight}%;
  left: ${costSpaceDeltaX * 100 / cardWidth}%;
  top: ${costSpaceDeltaY(index) * 100 / cardHeight}%;
`

const getCharacterTokenStyle = (index: number) => css`
  position: absolute;
  height: 10%;
  left: 2.5%;
  top: ${index * 9 + 3}%;
`

export default DevelopmentCardUnderConstruction