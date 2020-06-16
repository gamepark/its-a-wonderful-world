import {css, keyframes} from '@emotion/core'
import {useAnimations, usePlay} from '@interlude-games/workshop'
import {TFunction} from 'i18next'
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
import {isPlayer} from '../../types/typeguards'
import {
  areasX, boardHeight, boardTop, boardWidth, empireCardBottomMargin, empireCardHeight, empireCardLeftMargin, empireCardWidth, getAreaCardX, getAreaCardY, glow
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
    let translateX = -(getBoardResourceLeftPosition(resource) + cubePosition.x * resourceWidth / 2 + cubeDeltaX) * boardWidth / 100 - areasX
    let translateY = -(boardResourceTopPosition + cubeDeltaY + cubePosition.y * resourceHeight) * boardHeight / 100 - boardTop
    if (isPlaceResourceOnConstruction(move)) {
      const constructionIndex = player.constructionArea.findIndex(construction => construction.card === move.card)
      translateX += getAreaCardX(constructionIndex, player.constructionArea.length, game.players.length === 2) + costSpaceDeltaX - cubeWidth / 2
      translateY += getAreaCardY(1) + costSpaceDeltaY(move.space)
    } else {
      const resourcePosition = player.empireCardResources.filter(resource => resource !== Krystallium).length
      const destination = empireCardResourcePosition[resourcePosition % 5]
      translateX += empireCardLeftMargin + destination[0] * empireCardWidth / 100 - cubeWidth / 2
      translateY += 100 - empireCardBottomMargin - empireCardHeight + destination[1] * empireCardHeight / 100 + cubeHeight
    }
    const keyframe = keyframes`
      from {transform: none;}
      to {transform: translate(${translateX * 100 / cubeWidth}%, ${translateY * 100 / cubeHeight}%);}
    `
    return css`
      z-index: 10;
      animation: ${keyframe} ${animation.duration / 2}s ease-in-out forwards;
    `
  }
  const playerProduction = getProduction(player, resource)
  const hasMostProduction = !game.players.some(p => p.empire !== player.empire && getProduction(p, resource) >= playerProduction)
  const play = usePlay<Move>()
  const canPlayerValidate = isPlayer(player) && game.phase === Phase.Production && player.availableResources.length === 0 && !player.ready && game.productionStep === resource && player.bonuses.length === 0
  return (
    <>
      <img src={resourceCircle[resource]} css={[circleStyle, game.phase !== Phase.Draft && quantity === 0 && circleShadowedStyle]}
           alt={resourceAreaText[resource](t)} title={resourceAreaText[resource](t)} draggable="false"/>
      <button disabled={!canPlayerValidate} css={arrowStyle} onClick={() => play(tellYourAreReady(player.empire))} draggable="false" title={t('Valider')}/>
      <img src={resourceCharacter[resource]} alt={resourceCharacterText[resource](t)} title={resourceCharacterText[resource](t)} draggable="false"
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

const getBoardResourceLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 4
const getHighlightLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 2.5
const getNumberLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 6
const getCircleCharacterLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 6.25
const boardResourceTopPosition = 30
const cubeDeltaX = 2.6
const cubeDeltaY = 3.3
const resourceWidth = cubeWidth * 100 / boardWidth
const resourceHeight = cubeHeight * 100 / boardHeight

const resourceColor = {
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

const resourceAreaText = {
  [Materials]: (t: TFunction) => t('Zone de production des Matériaux (cubes blancs)'),
  [Energy]: (t: TFunction) => t('Zone de production de l’Énergie (cubes noirs)'),
  [Science]: (t: TFunction) => t('Zone de production de la Science (cubes verts)'),
  [Gold]: (t: TFunction) => t('Zone de production de l’Or (cubes jaunes)'),
  [Exploration]: (t: TFunction) => t('Zone de production de l’Exploration (cubes bleus)')
}

const resourceCharacterText = {
  [Materials]: (t: TFunction) => t('Le joueur produisant seul le plus de Matériaux gagne un jeton Financier'),
  [Energy]: (t: TFunction) => t('Le joueur produisant seul le plus d’Énergie gagne un jeton Militaire'),
  [Science]: (t: TFunction) => t('Le joueur produisant seul le plus de Science gagne un jeton Financier ou Militaire'),
  [Gold]: (t: TFunction) => t('Le joueur produisant seul le plus d’Or gagne un jeton Financier'),
  [Exploration]: (t: TFunction) => t('Le joueur produisant seul le plus d’Exploration gagne un jeton Militaire')
}

const areaHighlight = css`
  position: absolute;
  width: 9.5%;
  height: 50%;
  top: ${boardResourceTopPosition - 8}%;
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
  height: 13%;
  top: 57%;
  text-align:center;
  font-size: 2.5vh;
  font-weight: bold;
  text-shadow: 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black;
`

const resourceNumberStyle = {
  [Materials]: css`
    left: ${getNumberLeftPosition(Materials)}%;
    color:${resourceColor[Materials]};
  `,
  [Energy]: css`
    left: ${getNumberLeftPosition(Energy)}%;
    color:${resourceColor[Energy]};
  `,
  [Science]: css`
    left: ${getNumberLeftPosition(Science)}%;
    color:${resourceColor[Science]};
  `,
  [Gold]: css`
    left: ${getNumberLeftPosition(Gold)}%;
    color:${resourceColor[Gold]};
  `,
  [Exploration]: css`
    left: ${getNumberLeftPosition(Exploration)}%;
    color:${resourceColor[Exploration]};
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

const pulse = keyframes`
  to {transform: scale(1.4);}
`

const arrowStyle = css`
  width: 5%;
  height: 32%;
  vertical-align: middle;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  transition: opacity 0.5s ease-in-out;
  background-image: url(${boardArrow});
  background-size: cover;
  background-repeat:no-repeat;
  background-color:transparent;
  border:0 solid #FFF;
  &:disabled {
    opacity: 0.6;
  }
  &:enabled {
    animation: ${pulse} 0.8s linear alternate infinite;
    cursor: pointer;
  }
  &:focus {
    outline: 0;
  }
`

const characterStyle = css`
  position:absolute;
  width: 2.6%;
  top:6%;
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
  const cubeDispersion = index === 0 ? {x: 0, y: 0} : toHexagonalSpiralPosition(index - 1)
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