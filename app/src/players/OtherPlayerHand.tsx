import {css, keyframes} from '@emotion/core'
import ChooseDevelopmentCard, {isChooseDevelopmentCard} from '@gamepark/its-a-wonderful-world/moves/ChooseDevelopmentCard'
import PassCards, {isPassCards} from '@gamepark/its-a-wonderful-world/moves/PassCards'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {Animation, useAnimation} from '@gamepark/react-client'
import {Hand} from '@gamepark/react-components'
import React, {FunctionComponent} from 'react'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {cardHeight, cardRatio, cardStyle, cardWidth, playerPanelHeight, playerPanelWidth, playerPanelY} from '../util/Styles'
import {getChosenCardAnimation, hand2PlayersX, handPosition, handPosition2Players, handX, handY, playerHandCardStyle} from './PlayerHand'

type Props = { player: PlayerView, players: number, round: number, panelIndex: number }

const OtherPlayerHand: FunctionComponent<Props> = ({player, players, round, panelIndex}) => {
  const animation = useAnimation<ChooseDevelopmentCard | PassCards>(animation =>
    (isChooseDevelopmentCard(animation.move) && animation.move.playerId === player.empire) || isPassCards(animation.move)
  )
  const choosingCard = animation && isChooseDevelopmentCard(animation.move) ? animation.move : undefined
  const passingCard = animation && isPassCards(animation.move) ? animation.move : undefined
  const position = players > 2 ? handPosition : handPosition2Players

  const getItemProps = (index: number) => {
    const chosen = choosingCard && index === player.hand - 1
    const undo = choosingCard && animation?.action.cancelled
    const ignore = (chosen && !undo) || passingCard !== undefined
    return {
      ignore,
      css: passingCard || ignore ? css`z-index: 10;` : undefined,
      animation: animation ? {
        seconds: passingCard ? animation.duration * 3 / 10 : animation.duration,
        fromNeutralPosition: chosen && undo
      } : undefined
    }
  }

  const hand = [...Array(passingCard ? player.hand * 2 : player.hand)]

  return (
    <Hand css={[position, cardStyle]} rotationOrigin={50} gapMaxAngle={0.72} maxAngle={players > 2 ? 5 : 10} sizeRatio={cardRatio} getItemProps={getItemProps}>
      {hand.map((_, index) => <DevelopmentCard key={'#' + index} css={[playerHandCardStyle,
        animation && choosingCard && index === player.hand - 1 && getChosenCardAnimation(player, animation, players),
        animation && passingCard && (index < player.hand ?
          passCardAnimation(round % 2 === 1 ? (panelIndex + 1) % players : (panelIndex + players - 1) % players, animation, players) :
          receiveCardAnimation(round % 2 === 1 ? (panelIndex + players - 1) % players : (panelIndex + 1) % players, animation, players))]}/>)}
    </Hand>
  )
}

const passCardAnimation = (destination: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from {
      transform: none;
    }
    30% {
      transform: none;
    }
    70% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(destination) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) scale(0.5);
    }
    to {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(destination) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) scale(0);
    }
  `
  return css`
    animation: ${keyframe} ${animation.duration}s ease-in-out;
  `
}

const receiveCardAnimation = (origin: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) scale(0);
    }
    30% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) scale(0);
    }
    60% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) scale(0.5);
    }
    to {
      transform: none;
    }
  `
  return css`
    animation: ${keyframe} ${animation.duration}s ease-in-out;
  `
}

export default OtherPlayerHand