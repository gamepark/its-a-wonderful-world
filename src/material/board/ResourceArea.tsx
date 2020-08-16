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
import Theme, {LightTheme} from '../../Theme'
import GameView from '../../types/GameView'
import Phase from '../../types/Phase'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayer} from '../../types/typeguards'
import {
  areasX, boardHeight, boardTop, boardWidth, empireCardBottomMargin, empireCardHeight, empireCardLeftMargin, empireCardWidth, getAreaCardX, getAreaCardY, glow
} from '../../util/Styles'
import {resourcePosition as empireCardResourcePosition} from '../empires/EmpireCard'
import Images from '../Images'
import boardArrowWhite from '../menus/arrow-white.png'
import Resource, {resources} from '../resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth, images as resourceCubeImages} from '../resources/ResourceCube'

const {Materials, Energy, Science, Gold, Exploration, Krystallium} = Resource

type Props = { game: GameView, player: Player | PlayerView, resource: Resource, quantity: number }

const ResourceArea: FunctionComponent<Props> = ({game, player, resource, quantity}) => {
  const {t} = useTranslation()
  const [{dragging}, ref, preview] = useDrag({
    item: resourceFromBoard(resource),
    canDrag: isPlayer(player) && quantity > 0,
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
    const cubePosition = index === 0 ? {x: 0, y: 0} : toHexagonalSpiralPosition(index - 1)
    let translateX = -(getBoardResourceLeftPosition(resource) + 4 + cubePosition.x * resourceWidth / 2 + cubeDeltaX) * boardWidth / 100 - areasX
    let translateY = -(boardResourceTopPosition + cubeDeltaY + cubePosition.y * resourceHeight) * boardHeight / 100 - boardTop
    if (isPlaceResourceOnConstruction(move)) {
      const constructionIndex = player.constructionArea.findIndex(construction => construction.card === move.card)
      translateX += getAreaCardX(constructionIndex, player.constructionArea.length, game.players.length === 2) + costSpaceDeltaX
      translateY += getAreaCardY(1) + costSpaceDeltaY(move.space)
    } else {
      const resourcePosition = player.empireCardResources.filter(resource => resource !== Krystallium).length
      const destination = empireCardResourcePosition[resourcePosition % 5]
      translateX += empireCardLeftMargin + destination[0] * empireCardWidth / 100
      translateY += 100 - empireCardBottomMargin - empireCardHeight + destination[1] * empireCardHeight / 100
    }
    const keyframe = keyframes`
      from {transform: none;}
      to {transform: translate(${translateX * 100 / cubeWidth}%, ${translateY * 100 / cubeHeight}%);}
    `
    return css`
      z-index: 10;
      animation: ${keyframe} ${animation.duration}s ease-in-out forwards;
    `
  }
  const playerProduction = getProduction(player, resource)
  const hasMostProduction = !game.players.some(p => p.empire !== player.empire && getProduction(p, resource) >= playerProduction)
  const play = usePlay<Move>()
  const canPlayerValidate = isPlayer(player) && game.phase === Phase.Production && player.availableResources.length === 0 && !player.ready && game.productionStep === resource && player.bonuses.length === 0
  return (
    <>
      <div ref={ref}
           css={[circleStyle, circleStylePosition(resource), game.phase !== Phase.Draft && quantity === 0 && circleShadowedStyle, isPlayer(player) && quantity > 0 && canDragStyle]}/>
      <button disabled={!canPlayerValidate} css={(theme: Theme) => [arrowStyle, arrowTheme(theme), arrowPosition(resource)]}
              onClick={() => play(tellYourAreReady(player.empire))}
              title={t('Valider')}/>
      <img src={hasMostProduction ? resourceCharacterOn[resource] : resourceCharacterOff[resource]} alt={resourceCharacterText[resource](t)}
           title={resourceCharacterText[resource](t)} draggable="false"
           css={[characterStyle, css`left: ${getCircleCharacterLeftPosition(resource)}%`]}/>
      {quantity > 0 &&
      <>
        <DragPreviewImage connect={preview} src={resourceCubeImages[resource]}/>
        {[...Array(quantity)].map((_, index) =>
          <ResourceCube key={index} resource={resource}
                        css={[resourceStyle, getResourcePosition(index, resource), dragging && index === quantity - 1 && css`opacity: 0;`, getAnimation(index)]}/>
        )
        }
        <div css={[numberStyle, resourceNumberStyle[resource]]}>{quantity}</div>
      </>
      }
      {(game.phase === Phase.Production && game.productionStep === resource || quantity > 0) &&
      <div css={[areaHighlight, resourceAreaHighlight[resource]]}/>
      }
    </>
  )
}

const getBoardResourceLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20
const getHighlightLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 2.5
const getNumberLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 6
export const getCircleCharacterLeftPosition = (resource: Resource) => resources.indexOf(resource) * 20 + 4.9
export const circleCharacterTopPosition = 2.5
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
  [Materials]: Images.boardCircleGrey,
  [Energy]: Images.boardCircleBlack,
  [Science]: Images.boardCircleGreen,
  [Gold]: Images.boardCircleYellow,
  [Exploration]: Images.boardCircleBlue
}

const resourceCharacterOn = {
  [Materials]: Images.financierOn,
  [Energy]: Images.generalOn,
  [Science]: Images.financierGeneralOn,
  [Gold]: Images.financierOn,
  [Exploration]: Images.generalOn
}

const resourceCharacterOff = {
  [Materials]: Images.financierOff,
  [Energy]: Images.generalOff,
  [Science]: Images.financierGeneralOff,
  [Gold]: Images.financierOff,
  [Exploration]: Images.generalOff
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
  z-index:5;
  pointer-events: none;
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
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
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
  position: absolute;
  width: 15%;
  height: 86%;
  background-size: cover;
  vertical-align: middle;
  filter: drop-shadow(0.1em 0.1em 0.5em black);
  transition: opacity 0.5s ease-in-out;
`

const circleStylePosition = (resource: Resource) => css`
  background-image: url(${resourceCircle[resource]});
  left: ${getBoardResourceLeftPosition(resource)}%;
`

const circleShadowedStyle = css`
  opacity: 0.7;
`

const pulse = keyframes`
  to {transform: scale(1.4);}
`

const arrowStyle = css`
  position: absolute;
  top: 29%;
  width: 5%;
  height: 32%;
  vertical-align: middle;
  filter: drop-shadow(0.1em 0.1em 0.5em black);
  transition: opacity 0.5s ease-in-out;
  background-image: url(${boardArrowWhite});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: 0 solid #FFF;
  &:disabled {
    opacity: 0.6;
  }
  &:enabled {
    animation: ${pulse} 0.8s linear alternate infinite;
    cursor: pointer;
    background-image: url(${Images.arrowGreen});
  }
  &:focus {
    outline: 0;
  }
`

const arrowTheme = (theme: Theme) => css`
  &:enabled {
    filter: drop-shadow(0 0 0 ${theme.color === LightTheme ? 'white' : 'black'});
  }
`

const arrowPosition = (resource: Resource) => css`
  left: ${getBoardResourceLeftPosition(resource) + 15}%;
`

const characterStyle = css`
  position:absolute;
  width: 5.1%;
  top: ${circleCharacterTopPosition}%;
  pointer-events: none;
`

const resourceStyle = css`
  position: absolute;
  pointer-events: none;
  width: ${resourceWidth}%;
  height: ${resourceHeight}%;
`

const getResourcePosition = (index: number, resource: Resource) => {
  const cubeDispersion = index === 0 ? {x: 0, y: 0} : toHexagonalSpiralPosition(index - 1)
  return css`
    left: ${getBoardResourceLeftPosition(resource) + 4 + cubeDispersion.x * resourceWidth / 2 + cubeDeltaX}%;
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