import {css, keyframes} from '@emotion/core'
import {useAnimations, usePlay, usePlayerId} from '@interlude-games/workshop'
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
import {
  boardCirclesRatio, cardHeight, cardRatio, cardWidth, empireCardBottomMargin, empireCardLeftMargin, getAreaCardX, getAreaCardY, glow
} from '../../util/Styles'
import {resourcePosition as empireCardResourcePosition} from '../empires/EmpireCard'
import Resource from '../resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth, images as resourceCubeImages} from '../resources/ResourceCube'
import resourceCircleGrey from './board-circle-grey.png'
import resourceCircleBlack from './board-circle-black.png'
import resourceCircleGreen from './board-circle-green.png'
import resourceCircleYellow from './board-circle-yellow.png'
import resourceCircleBlue from './board-circle-blue.png'
import resourceCircleFinancier from '../characters/circle-financier.png'
import resourceCircleGeneral from '../characters/circle-general.png'
import resourceCircleFinancierGeneral from '../characters/circle-financier-general.png'
import boardArrow from './arrow-white-2.png'
import {useTranslation} from 'react-i18next'
import Phase from '../../types/Phase'
import {tellYourAreReady} from '../../moves/TellYouAreReady'
import Move from '../../moves/Move'
import {getProduction} from '../../Rules'
import EmpireName from '../empires/EmpireName'

type Props = { game: GameView, player: Player | PlayerView, resource: Resource, canDrag: boolean, quantity: number }

const ResourceArea: FunctionComponent<Props> = ({game, player, resource, canDrag, quantity}) => {
  const {t} = useTranslation()
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
  const isCircleHighlight = quantity !== 0 || game.phase === Phase.Draft
  const playerProduction = getProduction(player,resource)
  const singleMostPlayer = game.players.every( p => p.empire === player.empire || getProduction(p,resource) < playerProduction )
  const play = usePlay<Move>()
  const playerId = usePlayerId<EmpireName>()
  const canPlayerValidate = game.phase === Phase.Production && player && player.availableResources.length === 0 && !player.ready && game.productionStep === resource && player.bonuses.length === 0 && player.empire === playerId
  return (
    <>
      <img src={resourceCircle[resource]} css={circleStyle(isCircleHighlight)} alt={t(Resource[resource])} draggable="false"/>
      <button disabled={!canPlayerValidate} css={arrowStyle(canPlayerValidate)} onClick={() => play(tellYourAreReady(player.empire))} draggable="false" title={t('Validation des '+Resource[resource])}/>
      <img src={resourceCharacter[resource]} css={characterStyle(resource,singleMostPlayer)} alt={t(resourceCharacterText[resource])} draggable="false"/>
      { quantity !== 0 &&
        <>
        <DragPreviewImage connect={preview} src={resourceCubeImages[resource]}/>
        {[...Array(quantity)].map((_, index) =>
          <ResourceCube key={index} resource={resource}
          css={[getResourceStyle(index, resource), dragging && index === quantity - 1 && css`opacity: 0;`, getAnimation(index)]}/>
          )
        }
        <div ref={ref} key={resource} css={[getResourceAreaHighlight(resource), canDrag && canDragStyle]}/>
            <div css={getResourceNumberStyle(resource)}>{quantity}</div>
        </>
      }
    </>
  )
}

const resources = Object.values(Resource)

const getBoardResourceLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 3.5
const getHighlightLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 2.5
const getNumberLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 6
const getCircleCharacterLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 6.25
const boardResourceTopPosition = 20
const cubeDeltaX = 2.6
const cubeDeltaY = 3.3
const resourceWidth = cubeWidth * 1.6
const resourceHeight = cubeHeight * 1.6 * boardCirclesRatio

const resourceColor = {
  [Resource.Materials]: 'white',
  [Resource.Energy]: 'grey',
  [Resource.Science]: 'green',
  [Resource.Gold]: 'gold',
  [Resource.Exploration]: 'blue',
  [Resource.Krystallium]: 'red'
}

const resourceTextColor = {
  [Resource.Materials]: '#ddd6c5',
  [Resource.Energy]: '#808080',
  [Resource.Science]: '#c5d430',
  [Resource.Gold]: '#ffed67',
  [Resource.Exploration]: '#68c7f2',
  [Resource.Krystallium]: '#d91214'
}

const resourceCircle = {
  [Resource.Materials]: resourceCircleGrey,
  [Resource.Energy]: resourceCircleBlack,
  [Resource.Science]: resourceCircleGreen,
  [Resource.Gold]: resourceCircleYellow,
  [Resource.Exploration]: resourceCircleBlue,
}

const resourceCharacter = {
  [Resource.Materials]: resourceCircleFinancier,
  [Resource.Energy]: resourceCircleGeneral,
  [Resource.Science]: resourceCircleFinancierGeneral,
  [Resource.Gold]: resourceCircleFinancier,
  [Resource.Exploration]: resourceCircleGeneral,
}

const resourceCharacterText = {
  [Resource.Materials]: 'Financier des Matériaux',
  [Resource.Energy]: 'Général des Énergies',
  [Resource.Science]: 'Financier et Général des Sciences',
  [Resource.Gold]: 'Financier des Ors',
  [Resource.Exploration]: 'Général des Explorations',
}

const getResourceAreaHighlight = (resource: Resource) => css`
  position: absolute;
  width: 9.5%;
  height: 36%;
  left: ${getHighlightLeftPosition(resource)}%;
  top: ${boardResourceTopPosition-6}%;
  border-radius: 100%;
  animation: ${glow(resourceColor[resource])} 1s ease-in-out infinite alternate;
`

const getResourceNumberStyle = (resource: Resource) => css`
  position: absolute;
  width: 3%;
  height: 9%;
  left: ${getNumberLeftPosition(resource)}%;
  top: ${boardResourceTopPosition+19.5}%;
  text-align:center;
  color:${resourceTextColor[resource]};
  font-size: 2.5vh;
  font-weight: bold;
  text-shadow: 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black;
`

const canDragStyle = css`
  cursor: grab;
`

const circleStyle = (isResourcePresent: boolean) => css`
  width: 15%;
  vertical-align: middle;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  transition: opacity 0.5s ease-in-out;
  opacity: ${ isResourcePresent ? '1' : '0.8' };
`
const arrowStyle = (isActiveButton: boolean) => css`
  width: 5%;
  height:23%;
  vertical-align: middle;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  transition: opacity 0.5s ease-in-out;
  background-image: url(${boardArrow});
  background-size: cover;
  background-repeat:no-repeat;
  background-color:transparent;
  border:0 solid #FFF;
  opacity: ${ isActiveButton ? '1' : '0.6' };
  ${ isActiveButton ?  'transform: scale(1.4); &:hover {cursor:pointer;transform: scale(1.7);}' : '' };
  
`
const characterStyle = (resource: Resource, singleMostPlayer: boolean) => css`
  position:absolute;
  width: 2.5%;
  top:4.2%;
  left:${getCircleCharacterLeftPosition(resource)}%;
  transition: opacity 0.5s ease-in-out;
  opacity: ${ singleMostPlayer ? '1' : '0.5' };
  ${ singleMostPlayer ?  'filter: drop-shadow(0 0 5px white);' : '' };
`

const getResourceStyle = (index: number, resource: Resource) => {
  const cubeDispersion = toHexagonalSpiralPosition(index)
  return css`
    position: absolute;
    width: ${resourceWidth}%;
    height: ${resourceHeight}%;
    left: ${getBoardResourceLeftPosition(resource) + cubeDispersion.x * resourceWidth / 2 + cubeDeltaX}%;
    top: ${boardResourceTopPosition + cubeDispersion.y * resourceHeight + cubeDeltaY}%;
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