import {css, keyframes} from '@emotion/core'
import {useAnimations} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {DragPreviewImage, useDrag} from 'react-dnd'
import {resourceFromBoard} from '../../drag-objects/ResourceFromBoard'
import MoveType from '../../moves/MoveType'
import PlaceResource, {isPlaceResourceOnConstruction} from '../../moves/PlaceResource'
import {costSpaceDeltaX, costSpaceDeltaY} from '../../players/DevelopmentCardUnderConstruction'
import GameView from '../../types/GameView'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayerView} from '../../types/typeguards'
import {cardHeight, cardRatio, cardWidth, empireCardBottomMargin, empireCardLeftMargin, getAreaCardX, getAreaCardY, glow} from '../../util/Styles'
import {resourcePosition as empireCardResourcePosition} from '../empires/EmpireCard'
import Resource from '../resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth, images as resourceCubeImages} from '../resources/ResourceCube'

type Props = { game: GameView, player: Player | PlayerView, resource: Resource, canDrag: boolean, quantity: number }

const ResourceArea: FunctionComponent<Props> = ({game, player, resource, canDrag, quantity}) => {
  const [{dragging}, ref, preview] = useDrag({
    canDrag, item: resourceFromBoard(resource),
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  const animations = useAnimations<PlaceResource>(animation => animation.move.type === MoveType.PlaceResource && animation.move.playerId === player.empire
    && animation.move.resource === resource)
  const getAnimation = (index: number) => {
    if (animations.length < quantity - index) {
      return
    }
    const animation = animations[quantity - index - 1]
    const move = animation.move
    const cubePosition = toHexagonalSpiralPosition(index)
    let translateX = -(getBoardResourceLeftPosition(resource) + cubeDeltaX + cubePosition.x * cubeWidth / 2)
    let translateY = -(boardResourceTopPosition + cubeDeltaY + cubePosition.y * cubeHeight)
    if (isPlaceResourceOnConstruction(move)) {
      const constructionIndex = player.constructionArea.findIndex(construction => construction.card === move.card)
      translateX += getAreaCardX(constructionIndex, player.constructionArea.length, game.players.length === 2) + costSpaceDeltaX
      translateY += getAreaCardY(1) + costSpaceDeltaY(move.space)
    } else {
      const resourcePosition = player.empireCardResources.filter(resource => resource !== Resource.Krystallium).length
      const destination = empireCardResourcePosition[resourcePosition % 5]
      translateX += empireCardLeftMargin + cardWidth / cardRatio - destination[0] * cardWidth / cardRatio / 100 - cubeWidth
      translateY += 100 - empireCardBottomMargin - cardHeight * cardRatio + destination[1] * cardHeight * cardRatio / 100
    }
    if (animation.isAutomaticMove || isPlayerView(player)) {
      const keyframe = keyframes`
        from {transform: none;}
        to {transform: translate(${translateX / cubeWidth * 100}%, ${translateY / cubeHeight * 100}%);}
      `
      return css`
        z-index: 10;
        animation: ${keyframe} ${animation.duration}s ease-in-out;
      `
    } else {
      return css`
        z-index: 10;
        transform: translate(${translateX / cubeWidth * 100}%, ${translateY / cubeHeight * 100}%);
      `
    }
  }
  return (
    <>
      <DragPreviewImage connect={preview} src={resourceCubeImages[resource]}/>
      {[...Array(quantity)].map((_, index) =>
        <ResourceCube key={index} resource={resource}
                      css={[getResourceStyle(index, resource), dragging && index === quantity - 1 && css`opacity: 0;`, getAnimation(index)]}/>)}
      <div ref={ref} key={resource} css={[getResourceAreaHighlight(resource), canDrag && canDragStyle]}/>
    </>
  )
}

const resources = Object.values(Resource)

const getBoardResourceLeftPosition = (resource: Resource) => resources.indexOf(resource) * 13.5 + 13
const boardResourceTopPosition = 27
const cubeDeltaX = 2.6
const cubeDeltaY = 3.3

const getResourceAreaHighlight = (resource: Resource) => css`
  position: absolute;
  width: 6.5%;
  height: 12%;
  left: ${getBoardResourceLeftPosition(resource)}%;
  top: ${boardResourceTopPosition}%;
  border-radius: 100%;
  animation: ${glow(resourceColor[resource])} 1s ease-in-out infinite alternate;
`

const canDragStyle = css`
  cursor: grab;
`

const resourceColor = {
  [Resource.Materials]: 'white',
  [Resource.Energy]: 'black',
  [Resource.Science]: 'green',
  [Resource.Gold]: 'gold',
  [Resource.Exploration]: 'blue',
  [Resource.Krystallium]: 'red'
}

const getResourceStyle = (index: number, resource: Resource) => {
  const cubeDispersion = toHexagonalSpiralPosition(index)
  return css`
    position: absolute;
    width: ${cubeWidth}%;
    height: ${cubeHeight}%;
    left: ${getBoardResourceLeftPosition(resource) + cubeDispersion.x * cubeWidth / 2 + cubeDeltaX}%;
    top: ${boardResourceTopPosition + cubeDispersion.y * cubeHeight + cubeDeltaY}%;
  `
}

const toHexagonalSpiralPosition = (index: number) => {
  let distance = 1
  while (distance <= index / 6) {
    index -= distance * 6
    distance++
  }
  let rotation = Math.floor(index / distance)
  const xFactor = 2 / Math.sqrt(3)
  switch (rotation) {
    case 0:
      return {x: (distance + index) * -xFactor, y: distance - index}
    case 1:
      return {x: (index - distance * 3) * xFactor, y: distance - index}
    case 2:
      return {x: (index * 2 - distance * 5) * xFactor, y: -distance}
    case 3:
      return {x: (index - distance * 2) * xFactor, y: index - distance * 4}
    case 4:
      return {x: (distance * 6 - index) * xFactor, y: index - distance * 4}
    default:
      return {x: (distance * 11 - index * 2) * xFactor, y: distance}
  }
}

export default ResourceArea