/** @jsxImportSource @emotion/react */
import {css, keyframes, Theme} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import Resource, {resources} from '@gamepark/its-a-wonderful-world/material/Resource'
import MoveType from '@gamepark/its-a-wonderful-world/moves/MoveType'
import PlaceResource, {isPlaceResourceOnConstruction} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {getProduction} from '@gamepark/its-a-wonderful-world/Production'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useAnimations} from '@gamepark/react-client'
import {TFunction} from 'i18next'
import {useMemo} from 'react'
import {DragPreviewImage, useDrag} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {costSpaceDeltaX, costSpaceDeltaX2, costSpaceDeltaY, getConstructionSpaceLocation} from '../../players/DevelopmentCardUnderConstruction'
import {LightTheme} from '../../Theme'
import {
  areasX, boardHeight, boardTop, boardWidth, empireCardBottomMargin, empireCardHeight, empireCardLeftMargin, empireCardWidth, getAreaCardX, getAreaCardY, glow
} from '../../util/Styles'
import DragItemType from '../DragItemType'
import {resourcePosition as empireCardResourcePosition} from '../empires/EmpireCard'
import Images from '../Images'
import ResourceCube, {cubeHeight, cubeWidth, images as resourceCubeImages} from '../resources/ResourceCube'

const {Materials, Energy, Science, Gold, Exploration, Krystallium} = Resource

type Props = {
  game: GameView
  player: Player | PlayerView
  resource: Resource
  quantity: number
  validate: () => void
}

export default function ResourceArea({game, player, resource, quantity, validate}: Props) {
  const {t} = useTranslation()
  const [{dragging}, ref, preview] = useDrag({
    type: DragItemType.RESOURCE_FROM_BOARD,
    item: {resource},
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
      const {column, index} = getConstructionSpaceLocation(player.constructionArea[constructionIndex], move.space)
      translateX += getAreaCardX(constructionIndex, player.constructionArea.length, game.players.length === 2) + (column === 1 ? costSpaceDeltaX : costSpaceDeltaX2)
      translateY += getAreaCardY(1) + costSpaceDeltaY(column, index)
    } else {
      const resourcePosition = player.empireCardResources.filter(resource => resource !== Krystallium).length
      const destination = empireCardResourcePosition[resourcePosition % 5]
      translateX += empireCardLeftMargin + destination[0] * empireCardWidth / 100
      translateY += 100 - empireCardBottomMargin - empireCardHeight + destination[1] * empireCardHeight / 100
    }
    const keyframe = keyframes`
      from {
        transform: none;
      }
      to {
        transform: translate(${translateX * 100 / cubeWidth}%, ${translateY * 100 / cubeHeight}%);
      }
    `
    return css`
      z-index: 10;
      animation: ${keyframe} ${animation.duration}s ease-in-out forwards;
    `
  }
  const helpText = useMemo(() => getResourceHelpText(resource, t), [resource, t])
  const playerProduction = getProduction(player, resource)
  const hasMostProduction = !game.players.some(p => p.empire !== player.empire && getProduction(p, resource) >= playerProduction)
  const canPlayerValidate = isPlayer(player) && game.phase === Phase.Production && player.availableResources.length === 0 && !player.ready && game.productionStep === resource && player.bonuses.length === 0
  return (
    <>
      <div ref={ref}
           css={[circleStyle, circleStylePosition(resource), game.phase !== Phase.Draft && quantity === 0 && circleShadowedStyle, isPlayer(player) && quantity > 0 && canDragStyle]}/>
      <button disabled={!canPlayerValidate} css={(theme: Theme) => [arrowStyle, arrowTheme(theme), arrowPosition(resource)]}
              onClick={validate} title={t('Validate')}/>
      <img src={hasMostProduction ? resourceCharacterOn[resource] : resourceCharacterOff[resource]} alt={helpText}
           title={helpText} draggable="false"
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
      {((game.phase === Phase.Production && game.productionStep === resource) || quantity > 0) &&
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

function getResourceHelpText(resource: Resource, t: TFunction) {
  switch (resource) {
    case Resource.Materials:
      return t('The player producing the single most Materials receives a Financier token')
    case Resource.Energy:
      return t('The player producing the single most Energy receives a General token')
    case Resource.Science:
      return t('The player producing the single most Science receives a Financier or General token')
    case Resource.Gold:
      return t('The player producing the single most Gold receives a Financier token')
    case Resource.Exploration:
      return t('The player producing the single most Exploration receives a General token')
    default:
      return ''
  }
}

const areaHighlight = css`
  position: absolute;
  width: 9.5%;
  height: 50%;
  top: ${boardResourceTopPosition - 8}%;
  border-radius: 100%;
  z-index: 5;
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
  text-align: center;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
  pointer-events: none;
`

const resourceNumberStyle = {
  [Materials]: css`
    left: ${getNumberLeftPosition(Materials)}%;
    color: ${resourceColor[Materials]};
  `,
  [Energy]: css`
    left: ${getNumberLeftPosition(Energy)}%;
    color: ${resourceColor[Energy]};
  `,
  [Science]: css`
    left: ${getNumberLeftPosition(Science)}%;
    color: ${resourceColor[Science]};
  `,
  [Gold]: css`
    left: ${getNumberLeftPosition(Gold)}%;
    color: ${resourceColor[Gold]};
  `,
  [Exploration]: css`
    left: ${getNumberLeftPosition(Exploration)}%;
    color: ${resourceColor[Exploration]};
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
  to {
    transform: scale(1.4);
  }
`

const arrowStyle = css`
  position: absolute;
  top: 29%;
  width: 5%;
  height: 32%;
  vertical-align: middle;
  filter: drop-shadow(0.1em 0.1em 0.5em black);
  transition: opacity 0.5s ease-in-out;
  background-image: url(${Images.arrowWhite});
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
  position: absolute;
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