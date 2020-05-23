import {css, keyframes} from '@emotion/core'
import {Hand, useAnimation} from '@interlude-games/workshop'
import Animation from '@interlude-games/workshop/dist/Types/Animation'
import React, {FunctionComponent} from 'react'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {
  bottomMargin, cardHeight, cardRatio, cardStyle, cardWidth, constructedCardLeftMargin, getAreaCardX, getAreaCardY, playerPanelWidth
} from '../util/Styles'

type Props = { player: Player, players: number }

const PlayerHand: FunctionComponent<Props> = ({player, players}) => {
  const chooseCardAnimation = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type === MoveType.ChooseDevelopmentCard && animation.move.playerId === player.empire)
  const position = players > 2 ? handPosition : handPosition2Players

  const getItemProps = (index: number) => {
    const chosen = player.hand[index] === chooseCardAnimation?.move.card
    const undo = chooseCardAnimation?.undo
    return ({
      ignore: chosen && !undo,
      hoverStyle: css`transform: scale(1.5);`,
      drag: {
        item: developmentFromHand(player.hand[index]),
        disabled: !!player.chosenCard || player.hand.length === 1,
        animation: {seconds: chooseCardAnimation?.duration ?? 0.2}
      },
      css: chosen && !undo ? css`z-index: 10;` : undefined,
      animation: chooseCardAnimation ? {
        seconds: chooseCardAnimation.duration,
        fromNeutralPosition: chosen && undo
      } : undefined
    })
  }

  return (
    <Hand css={[position, cardStyle]} rotationOrigin={50} gapMaxAngle={0.72} sizeRatio={cardRatio} getItemProps={getItemProps}>
      {player.hand.map(card => <DevelopmentCard key={card} development={developmentCards[card]} css={[playerHandCardStyle,
        chooseCardAnimation?.move.card === card && getChosenCardAnimation(player, chooseCardAnimation, players)]}/>)}
    </Hand>
  )
}

const hand2PlayersX = 50 + (constructedCardLeftMargin + 1) / 2
const handX = hand2PlayersX - (playerPanelWidth + 1) / 2
const handY = 100 - cardHeight - bottomMargin

export const handPosition2Players = css`
  left: ${hand2PlayersX}%;
  top: ${handY}%;
`

export const handPosition = css`
  left: ${handX}%;
  top: ${handY}%;
`

export const playerHandCardStyle = css`
  height: 100%;
  width: 100%;
  transform-origin: bottom;
`

export const getChosenCardAnimation = (player: Player | PlayerView, animation: Animation<ChooseDevelopmentCard>, players: number) => {
  if (animation.undo) {
    return translateFromDraftArea(player.draftArea.length, animation.duration, players)
  } else {
    return translateToDraftArea(player.draftArea.length, animation.duration, players)
  }
}

const translateToDraftArea = (index: number, transitionDuration: number, players: number) => css`
  transform: translate(${(getAreaCardX(index) - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%,
    ${(getAreaCardY(1) - handY) * 100 / cardHeight}%);
  transition: transform ${transitionDuration}s ease-in-out;
`

const translateFromDraftArea = (index: number, transitionDuration: number, players: number) => {
  const keyframe = keyframes`
    from {
      transform: translate(${(getAreaCardX(index) - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%,
        ${(getAreaCardY(1) - handY) * 100 / cardHeight}%);
    }
  `
  return css`
    animation: ${keyframe} ${transitionDuration}s ease-in-out forwards;
  `
}

export default PlayerHand