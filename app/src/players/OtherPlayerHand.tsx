/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {developmentCards, getCardType} from '@gamepark/its-a-wonderful-world/material/Developments'
import PassCards, {isPassCards} from '@gamepark/its-a-wonderful-world/moves/PassCards'
import {isRevealChosenCards, RevealChosenCardsView} from '@gamepark/its-a-wonderful-world/moves/RevealChosenCards'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {Animation, useAnimation} from '@gamepark/react-client'
import {Hand} from '@gamepark/react-components'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {cardHeight, cardRatio, cardStyle, cardWidth, getAreaCardX, getAreaCardY, playerPanelHeight, playerPanelWidth, playerPanelY} from '../util/Styles'
import {
  getPlayerPassingCardsTo, getPlayerReceivingCardsFrom, hand2PlayersX, handPosition, handPosition2Players, handX, handY, playerHandCardStyle
} from './PlayerHand'
import usePlayersStartingWithMe from './usePlayersStartingWithMe'

type Props = {
  player: PlayerView
  game: GameView
}

export default function OtherPlayerHand({player, game}: Props) {
  const players = usePlayersStartingWithMe(game)
  const animation = useAnimation<RevealChosenCardsView | PassCards>(animation =>
    (isRevealChosenCards(animation.move)) || isPassCards(animation.move)
  )
  const cardBeingRevealed = animation && isRevealChosenCards(animation.move) ? animation.move.revealedCards[player.empire] : undefined
  const passingCard = animation && isPassCards(animation.move) && player.cardsToPass ? animation.move : undefined
  const receivingCardsFrom = passingCard && getPlayerReceivingCardsFrom(game, player)
  const passingCardsTo = passingCard && getPlayerPassingCardsTo(game, player)
  const cardsBeingReceived = receivingCardsFrom && (isPlayer(receivingCardsFrom) ? receivingCardsFrom.cardsToPass!.map(getCardType) : receivingCardsFrom.cardsToPass)

  const position = players.length > 2 ? handPosition : handPosition2Players

  const getItemProps = (index: number) => {
    const chosen = index === cardBeingRevealed?.index
    const ignore = chosen || passingCard !== undefined
    return {
      ignore,
      css: passingCard || ignore ? css`z-index: 10;` : undefined,
      animation: {
        seconds: animation ? passingCard ? animation.duration * 3 / 10 : getRevealingCardAnimationDuration(animation, players) : 0.5,
        delay: animation && cardBeingRevealed !== undefined ? getRevealingCardAnimationDelay(player, players) : undefined
      }
    }
  }

  const hand = cardsBeingReceived ? [...player.cardsToPass!, ...cardsBeingReceived] : player.hiddenHand

  return (
    <Hand css={[position, cardStyle]} rotationOrigin={50} gapMaxAngle={0.72} maxAngle={players.length > 2 ? 5 : 6.9} sizeRatio={cardRatio}
          getItemProps={getItemProps}>
      {hand.map((deckType, index) =>
        <DevelopmentCard key={'#' + index} deckType={deckType} development={index === cardBeingRevealed?.index ? developmentCards[cardBeingRevealed!.card] : undefined}
                         css={[playerHandCardStyle,
                           animation && index === cardBeingRevealed?.index && getRevealingCardAnimation(player, animation, players),
                           animation && passingCard && (index < player.hiddenHand.length ?
                             passCardAnimation(players.indexOf(passingCardsTo!), animation, players.length) :
                             receiveCardAnimation(players.indexOf(receivingCardsFrom!), animation, players.length))]}/>
      )}
    </Hand>
  )
}

const getRevealingCardAnimation = (player: Player | PlayerView, animation: Animation, players: (Player | PlayerView)[]) => {
  const keyframe = keyframes`
    from {
      transform: rotateY(180deg);
    }
    to {
      transform: translate(${(getAreaCardX(player.draftArea.length) - (players.length > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%,
      ${(getAreaCardY(1) - handY) * 100 / cardHeight}%);
    }
  `
  const duration = getRevealingCardAnimationDuration(animation, players)
  const delayedOrder = getRevealingCardAnimationDelay(player, players)
  return css`
    animation: ${keyframe} ${duration}s ${delayedOrder * duration * 7 / 10}s ease-in-out both;
  `
}

function getRevealingCardAnimationDuration(animation: Animation, players: (Player | PlayerView)[]) {
  const isPlaying = players.some(isPlayer)
  return animation.duration * 0.7 / (isPlaying ? players.length - 1 : players.length)
}

function getRevealingCardAnimationDelay(player: Player | PlayerView, players: (Player | PlayerView)[]) {
  const isPlaying = players.some(isPlayer)
  return isPlaying ? players.indexOf(player) - 1 : players.indexOf(player)
}

const passCardAnimation = (destination: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from, 30% {
      transform: rotateY(180deg);
    }
    70% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(destination, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0.5);
    }
    to {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(destination, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0);
    }
  `
  return css`
    animation: ${keyframe} ${animation.duration}s ease-in-out;
  `
}

const receiveCardAnimation = (origin: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from, 30% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0);
    }
    60% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0.5);
    }
    to {
      transform: rotateY(180deg);
    }
  `
  return css`
    animation: ${keyframe} ${animation.duration}s ease-in-out;
  `
}
