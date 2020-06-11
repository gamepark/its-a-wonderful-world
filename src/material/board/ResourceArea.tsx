import {css, keyframes} from '@emotion/core'
import {useAnimations, usePlay} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {DragPreviewImage, useDrag} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {resourceFromBoard} from '../../drag-objects/ResourceFromBoard'
import Move from '../../moves/Move'
import MoveType from '../../moves/MoveType'
import PlaceResource, {isPlaceResourceOnConstruction} from '../../moves/PlaceResource'
import {tellYourAreReady} from '../../moves/TellYouAreReady'
import {costSpaceDeltaX, costSpaceDeltaY} from '../../players/DevelopmentCardUnderConstruction'
import {getProduction} from '../../Rules'
import GameView from '../../types/GameView'
import Phase from '../../types/Phase'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayer, isPlayerView} from '../../types/typeguards'
import {
  boardCirclesRatio, cardHeight, cardRatio, cardWidth, empireCardBottomMargin, empireCardLeftMargin, getAreaCardX, getAreaCardY, glow
} from '../../util/Styles'
import resourceCircleFinancierGeneral from '../characters/circle-financier-general.png'
import resourceCircleFinancier from '../characters/circle-financier.png'
import resourceCircleGeneral from '../characters/circle-general.png'
import {resourcePosition as empireCardResourcePosition} from '../empires/EmpireCard'
import Resource, {resources} from '../resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth, images as resourceCubeImages} from '../resources/ResourceCube'
import boardArrow from './arrow-white-2.png'
import resourceCircleBlack from './board-circle-black.png'
import resourceCircleBlue from './board-circle-blue.png'
import resourceCircleGreen from './board-circle-green.png'
import resourceCircleGrey from './board-circle-grey.png'
import resourceCircleYellow from './board-circle-yellow.png'

const {Materials, Energy, Science, Gold, Exploration, Krystallium} = Resource

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
      const resourcePosition = player.empireCardResources.filter(resource => resource !== Krystallium).length
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
  const playerProduction = getProduction(player, resource)
  const hasMostProduction = !game.players.some(p => p.empire !== player.empire && getProduction(p, resource) >= playerProduction)
  const play = usePlay<Move>()
  const canPlayerValidate = isPlayer(player) && game.phase === Phase.Production && player.availableResources.length === 0 && !player.ready && game.productionStep === resource && player.bonuses.length === 0
  return (
    <>
      <img src={resourceCircle[resource]} css={[circleStyle, game.phase !== Phase.Draft && quantity === 0 && circleShadowedStyle]}
           alt={t(Resource[resource])} draggable="false"/>
      <button disabled={!canPlayerValidate} css={arrowStyle} onClick={() => play(tellYourAreReady(player.empire))} draggable="false"
              title={t('Validation des ' + Resource[resource])}/>
      <img src={resourceCharacter[resource]} alt={t(resourceCharacterText[resource])} draggable="false"
           css={[characterStyle, hasMostProduction && characterHighlightStyle, css`left: ${getCircleCharacterLeftPosition(resource)}%`]}/>
      {quantity !== 0 &&
      <>
        <DragPreviewImage connect={preview} src={resourceCubeImages[resource]}/>
        {[...Array(quantity)].map((_, index) =>
          <ResourceCube key={index} resource={resource}
                        css={[resourceStyle, getResourcePosition(index, resource), dragging && index === quantity - 1 && css`opacity: 0;`, getAnimation(index)]}/>
        )
        }
        <div ref={ref} key={resource} css={[areaHighlight, resourceAreaHighlight[resource], canDrag && canDragStyle]}/>
        <div css={[numberStyle, resourceNumberStyle[resource]]}>{quantity}</div>
      </>
      }
    </>
  )
}

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
  [Materials]: 'white',
  [Energy]: 'grey',
  [Science]: 'green',
  [Gold]: 'gold',
  [Exploration]: 'blue',
  [Krystallium]: 'red'
}

const resourceTextColor = {
  [Materials]: '#ddd6c5',
  [Energy]: '#808080',
  [Science]: '#c5d430',
  [Gold]: '#ffed67',
  [Exploration]: '#68c7f2',
  [Krystallium]: '#d91214'
}

const resourceCircle = {
  [Materials]: resourceCircleGrey,
  [Energy]: resourceCircleBlack,
  [Science]: resourceCircleGreen,
  [Gold]: resourceCircleYellow,
  [Exploration]: resourceCircleBlue
}

const resourceCharacter = {
  [Materials]: resourceCircleFinancier,
  [Energy]: resourceCircleGeneral,
  [Science]: resourceCircleFinancierGeneral,
  [Gold]: resourceCircleFinancier,
  [Exploration]: resourceCircleGeneral
}

const resourceCharacterText = {
  [Materials]: 'Financier des Matériaux',
  [Energy]: 'Général des Énergies',
  [Science]: 'Financier et Général des Sciences',
  [Gold]: 'Financier des Ors',
  [Exploration]: 'Général des Explorations'
}

const areaHighlight = css`
  position: absolute;
  width: 9.5%;
  height: 36%;
  top: ${boardResourceTopPosition - 6}%;
  border-radius: 100%;
`

const resourceAreaHighlight = {
  [Materials]: css`
    left: ${getHighlightLeftPosition(Materials)}%;
    animation: ${glow(resourceColor[Materials])} 1s ease-in-out infinite alternate;
  `,
  [Energy]: css`
    left: ${getHighlightLeftPosition(Energy)}%;
    animation: ${glow(resourceColor[Energy])} 1s ease-in-out infinite alternate;
  `,
  [Science]: css`
    left: ${getHighlightLeftPosition(Science)}%;
    animation: ${glow(resourceColor[Science])} 1s ease-in-out infinite alternate;
  `,
  [Gold]: css`
    left: ${getHighlightLeftPosition(Gold)}%;
    animation: ${glow(resourceColor[Gold])} 1s ease-in-out infinite alternate;
  `,
  [Exploration]: css`
    left: ${getHighlightLeftPosition(Exploration)}%;
    animation: ${glow(resourceColor[Exploration])} 1s ease-in-out infinite alternate;
  `
}

const numberStyle = css`
  position: absolute;
  width: 3%;
  height: 9%;
  top: ${boardResourceTopPosition + 19.5}%;
  text-align:center;
  font-size: 2.5vh;
  font-weight: bold;
  text-shadow: 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black;
`

const resourceNumberStyle = {
  [Materials]: css`
    left: ${getNumberLeftPosition(Materials)}%;
    color:${resourceTextColor[Materials]};
  `,
  [Energy]: css`
    left: ${getNumberLeftPosition(Energy)}%;
    color:${resourceTextColor[Energy]};
  `,
  [Science]: css`
    left: ${getNumberLeftPosition(Science)}%;
    color:${resourceTextColor[Science]};
  `,
  [Gold]: css`
    left: ${getNumberLeftPosition(Gold)}%;
    color:${resourceTextColor[Gold]};
  `,
  [Exploration]: css`
    left: ${getNumberLeftPosition(Exploration)}%;
    color:${resourceTextColor[Exploration]};
  `
}

const canDragStyle = css`
  cursor: grab;
`

const circleStyle = css`
  width: 15%;
  vertical-align: middle;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  transition: opacity 0.5s ease-in-out;
`

const circleShadowedStyle = css`
  opacity: 0.7;
`

const arrowStyle = css`
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
  &:disabled {
  &:disabled {
    opacity: 0.6;
  }
  &:not(:disabled) {
    transform: scale(1.4);
    cursor: pointer;
    &:hover {
      transform: scale(1.7);
    }
  }
`

const characterStyle = css`
  position:absolute;
  width: 2.5%;
  top:4.2%;
  transition: opacity 0.5s ease-in-out;
  opacity: 0.5;
`

const characterHighlightStyle = css`
  opacity: 1;
  filter: drop-shadow(0 0 5px white);
`

const resourceStyle = css`
  position: absolute;
  width: ${resourceWidth}%;
  height: ${resourceHeight}%;
`

const getResourcePosition = (index: number, resource: Resource) => {
  const cubeDispersion = toHexagonalSpiralPosition(index)
  return css`
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