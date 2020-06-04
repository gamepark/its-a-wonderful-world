import {css, keyframes} from '@emotion/core'
import {Hand, useAnimation} from '@interlude-games/workshop'
import Animation from '@interlude-games/workshop/dist/Types/Animation'
import React, {FunctionComponent} from 'react'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import ChooseDevelopmentCard, {isChooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'
import {isPassCards, PassCardsView} from '../moves/PassCards'
import {isRevealChosenCards, RevealChosenCardsView} from '../moves/RevealChosenCards'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {
  bottomMargin, cardHeight, cardRatio, cardStyle, cardWidth, constructedCardLeftMargin, getAreaCardX, getAreaCardY, playerPanelHeight, playerPanelWidth,
  playerPanelY
} from '../util/Styles'

type Props = { player: Player, players: number, round: number }

const PlayerHand: FunctionComponent<Props> = ({player, players, round}) => {
  const animation = useAnimation<ChooseDevelopmentCard | RevealChosenCardsView | PassCardsView>(animation =>
    (isChooseDevelopmentCard(animation.move) && animation.move.playerId === player.empire) || isRevealChosenCards(animation.move) || isPassCards(animation.move)
  )
  const choosingCard = animation && isChooseDevelopmentCard(animation.move) ? animation.move : undefined
  const passingCard = animation && isPassCards(animation.move) ? animation.move : undefined
  const position = players > 2 ? handPosition : handPosition2Players

  const getItemProps = (index: number) => {
    const chosen = index < player.hand.length && player.hand[index] === choosingCard?.card
    const undo = choosingCard && animation?.undo
    const received = passingCard && index >= player.hand.length
    const ignore = (chosen && !undo) || (passingCard && !received)
    return ({
      ignore,
      hoverStyle: css`transform: translateY(-25%) scale(1.5);`,
      drag: {
        item: developmentFromHand(player.hand[index]),
        disabled: !!player.chosenCard || player.hand.length === 1 || animation?.move.type === MoveType.RevealChosenCards,
        animation: {seconds: animation?.duration ?? 0.2}
      },
      css: passingCard ? getZIndexRevert(index) : ignore ? css`z-index: 10;` : undefined,
      animation: animation ? {
        seconds: passingCard ? animation.duration * 3 / 10 : animation.duration,
        delay: passingCard && index >= player.hand.length ? animation.duration * 7 / 10 : 0,
        fromNeutralPosition: (chosen && undo) || received
      } : undefined
    })
  }

  // When we flip the cards, we must revert their z-indexes: the top one will end at the bottom.
  const getZIndexRevert = (index: number) => {
    const duration = (animation?.duration ?? 0) * 3 / 10
    if (index < player.hand.length) {
      const keyframe = keyframes`
      from {z-index: ${index * 10}}
      to {z-index: ${(player.hand.length - index) * 10}}
    `
      return css`
        z-index: 10;
        animation: ${keyframe} ${duration}s ease-in-out
      `
    } else {
      const delay = (animation?.duration ?? 0) * 7 / 10
      const keyframe = keyframes`
      from {z-index: ${(hand.length - index) * 10}}
      to {z-index: ${index * 10}}
    `
      return css`
        z-index: 10;
        animation: ${keyframe} ${duration}s ${delay}s ease-in-out
      `
    }
  }

  const hand = [...player.hand]
  if (passingCard) {
    hand.push(...passingCard.receivedCards)
  }

  return (
    <Hand css={[position, cardStyle]} rotationOrigin={50} gapMaxAngle={0.72} sizeRatio={cardRatio} getItemProps={getItemProps}>
      {hand.map((card, index) => <DevelopmentCard key={card} development={developmentCards[card]} css={[playerHandCardStyle,
        choosingCard?.card === card && animation && getChosenCardAnimation(player, animation, players),
        animation && passingCard && (index < player.hand.length ?
          passCardAnimation(round % 2 === 1 ? 1 : players - 1, animation, players) :
          receiveCardAnimation(round % 2 === 1 ? players - 1 : 1, animation, players))]}/>)}
    </Hand>
  )
}

export const hand2PlayersX = 50 + (constructedCardLeftMargin + 1) / 2
export const handX = hand2PlayersX - (playerPanelWidth + 1) / 2
export const handY = 100 - cardHeight - bottomMargin

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
  will-change: transform;
`

export const getChosenCardAnimation = (player: Player | PlayerView, animation: Animation, players: number) => {
  if (animation.undo) {
    return translateFromDraftArea(player.draftArea.length, animation.duration, players)
  } else if (animation.isAutomaticMove) {
    return animateToDraftArea(player.draftArea.length, animation.duration, players)
  } else {
    return translateToDraftArea(player.draftArea.length, animation.duration, players)
  }
}

const animateToDraftArea = (index: number, transitionDuration: number, players: number) => {
  const keyframe = keyframes`
    from {
      transform: none;
    }
    to {
      transform: translate(${(getAreaCardX(index) - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%,
        ${(getAreaCardY(1) - handY) * 100 / cardHeight}%);
    }
  `
  return css`
    animation: ${keyframe} ${transitionDuration}s ease-in-out forwards;
  `
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

const passCardAnimation = (destination: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from {
      transform: perspective(100vh);
    }
    30% {
      transform: perspective(100vh) rotateY(180deg)
    }
    70% {
      transform:
       translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%)
       translateY(${(playerPanelY(destination) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%)
       rotateY(180deg) scale(0.5);
    }
    to {
      transform:
       translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%)
       translateY(${(playerPanelY(destination) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%)
       rotateY(180deg) scale(0);
    } 
  `
  return css`animation: ${keyframe} ${animation.duration}s ease-in-out;`
}

const receiveCardAnimation = (origin: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from {
      transform:
       translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%)
       translateY(${(playerPanelY(origin) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%)
       rotateY(180deg) scale(0);
    }
    30% {
      transform:
       translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%)
       translateY(${(playerPanelY(origin) + playerPanelHeight / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%)
       rotateY(180deg) scale(0.5);
    }
    70% {
      transform: perspective(100vh) rotateY(180deg)
    }
    to {
      transform: perspective(100vh);
    }
  `
  return css`animation: ${keyframe} ${animation.duration}s ease-in-out;`
}

export default PlayerHand