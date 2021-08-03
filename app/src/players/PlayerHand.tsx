/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {developmentCards, getCardDetails} from '@gamepark/its-a-wonderful-world/material/Developments'
import ChooseDevelopmentCard, {chooseDevelopmentCardMove, isChooseDevelopmentCard} from '@gamepark/its-a-wonderful-world/moves/ChooseDevelopmentCard'
import MoveType from '@gamepark/its-a-wonderful-world/moves/MoveType'
import {isPassCards, PassCardsView} from '@gamepark/its-a-wonderful-world/moves/PassCards'
import {isRevealChosenCards, RevealChosenCardsView} from '@gamepark/its-a-wonderful-world/moves/RevealChosenCards'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {Animation, useAnimation, usePlay} from '@gamepark/react-client'
import {Hand} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import FocusedDevelopmentOptions from '../material/developments/FocusedDevelopmentOptions'
import DragItemType from '../material/DragItemType'
import Images from '../material/Images'
import {
  bottomMargin, cardHeight, cardRatio, cardStyle, cardWidth, constructedCardLeftMargin, getAreaCardX, getAreaCardY, playerPanelHeight, playerPanelWidth,
  playerPanelY, popupBackgroundStyle
} from '../util/Styles'
import {textButton, textButtonLeft} from './DraftArea'
import usePlayersStartingWithMe from './usePlayersStartingWithMe'

type Props = {
  player: Player
  game: GameView
}

export default function PlayerHand({player, game}: Props) {
  const {t} = useTranslation()
  const play = usePlay<ChooseDevelopmentCard>()
  const [focusedCard, setFocusedCard] = useState<number>()
  const players = usePlayersStartingWithMe(game)
  const animation = useAnimation<ChooseDevelopmentCard | RevealChosenCardsView | PassCardsView>(animation =>
    (isChooseDevelopmentCard(animation.move) && animation.move.playerId === player.empire) || isRevealChosenCards(animation.move) || isPassCards(animation.move)
  )
  const choosingCard = animation && isChooseDevelopmentCard(animation.move) ? animation.move : undefined
  const passingCard = animation && isPassCards(animation.move) ? animation.move : undefined
  const receivingCardsFrom = passingCard && getPlayerReceivingCardsFrom(game, player)
  const passingCardsTo = passingCard && getPlayerPassingCardsTo(game, player)
  const position = players.length > 2 ? handPosition : handPosition2Players
  const canChooseCard = player.chosenCard === undefined && player.hand.length >= 1 && animation?.move.type !== MoveType.RevealChosenCards

  const getItemProps = (index: number) => {
    const card = player.hand[index]
    const chosen = index < player.hand.length && card === choosingCard?.card
    const undo = choosingCard && animation?.action.cancelled
    const received = passingCard && index >= player.hand.length
    const ignore = (chosen && !undo) || (passingCard && !received)
    return ({
      ignore,
      hoverStyle: css`transform: translateY(-25%) scale(1.5);`,
      drag: {
        type: DragItemType.DEVELOPMENT_FROM_HAND,
        item: {card},
        canDrag: canChooseCard,
        animation: {seconds: animation?.duration ?? 0.2},
        drop: () => play(chooseDevelopmentCardMove(player.empire, card))
      },
      css: passingCard ? getZIndexRevert(index) : ignore ? css`z-index: 10;` : undefined,
      animation: animation ? {
        seconds: passingCard ? animation.duration * 3 / 10 : animation.duration,
        delay: passingCard && index >= player.hand.length ? animation.duration * 7 / 10 : 0,
        fromNeutralPosition: (chosen && undo) || received
      } : undefined,
      onClick: () => setFocusedCard(card)
    })
  }

  // When we flip the cards, we must revert their z-indexes: the top one will end at the bottom.
  const getZIndexRevert = (index: number) => {
    const duration = (animation?.duration ?? 0) * 3 / 10
    if (index < player.hand.length) {
      const keyframe = keyframes`
        from {
          z-index: ${index * 10}
        }
        to {
          z-index: ${(player.hand.length - index) * 10}
        }
      `
      return css`
        z-index: 10;
        animation: ${keyframe} ${duration}s ease-in-out both;
      `
    } else {
      const delay = (animation?.duration ?? 0) * 7 / 10
      const keyframe = keyframes`
        from {
          z-index: ${(hand.length - index) * 10}
        }
        to {
          z-index: ${index * 10}
        }
      `
      return css`
        z-index: 10;
        animation: ${keyframe} ${duration}s ${delay}s ease-in-out both;
      `
    }
  }

  const hand = player.hand.filter(card => card !== player.chosenCard)
  if (passingCard) {
    hand.push(...passingCard.receivedCards)
  }

  useEffect(() => {
    if (typeof focusedCard == 'number' && (animation || hand.indexOf(focusedCard) === -1)) {
      setFocusedCard(undefined)
    }
  }, [hand, focusedCard, animation])

  return (
    <>
      {focusedCard !== undefined &&
      <>
        <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
        <DevelopmentCard development={developmentCards[focusedCard]} css={focusCardStyle}/>
        {canChooseCard &&
        <button css={[textButton, textButtonLeft, chooseCardButton]} onClick={() => play(chooseDevelopmentCardMove(player.empire, focusedCard))}>
          {t('Choose')}
        </button>}
        <FocusedDevelopmentOptions development={getCardDetails(focusedCard)} onClose={() => setFocusedCard(undefined)}/>
      </>
      }
      <Hand css={[position, cardStyle]} rotationOrigin={50} gapMaxAngle={0.72} maxAngle={players.length > 2 ? 5 : 6.9} sizeRatio={cardRatio}
            getItemProps={getItemProps}>
        {hand.map((card, index) => <DevelopmentCard key={card} development={developmentCards[card]} css={[playerHandCardStyle,
          choosingCard?.card === card && animation && getChosenCardAnimation(player, animation, players.length),
          animation && passingCard && (index < player.hand.length ?
            passCardAnimation(players.indexOf(passingCardsTo!), animation, players.length) :
            receiveCardAnimation(players.indexOf(receivingCardsFrom!), animation, players.length))]}/>)}
      </Hand>
    </>
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
  if (animation.action.cancelled) {
    return translateFromDraftArea(player.draftArea.length, animation.duration, players)
  } else if (animation.action.move !== animation.move) {
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
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(destination, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0.5);
    }
    to {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(destination, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0);
    }
  `
  return css`animation: ${keyframe} ${animation.duration}s ease-in-out;`
}

const receiveCardAnimation = (origin: number, animation: Animation, players: number) => {
  const keyframe = keyframes`
    from {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0);
    }
    30% {
      transform: translateX(${(100 - playerPanelWidth - 1 - (players > 2 ? handX : hand2PlayersX)) * 100 / cardWidth}%) translateY(${(playerPanelY(origin, players) + playerPanelHeight(players) / 2 - cardHeight / 2 - handY) * 100 / cardHeight}%) rotateY(180deg) scale(0.5);
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

const focusCardStyle = css`
  position: absolute;
  width: ${cardWidth * 3}%;
  height: ${cardHeight * 3}%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  h3 {
    font-size: 2.55em;
  }
`

const chooseCardButton = css`
  top: 45%;
  right: ${51 + cardWidth * 1.5}%;

  &:before {
    background-image: url(${Images.titleOrange});
  }
`

export function getPlayerReceivingCardsFrom(game: GameView, player: Player | PlayerView) {
  const players = game.players.filter(player => player.cardsToPass)
  const index = players.indexOf(player)
  return players[(game.round % 2 === 0 ? index + 1 : index + players.length - 1) % players.length]
}

export function getPlayerPassingCardsTo(game: GameView, player: Player | PlayerView) {
  const players = game.players.filter(player => player.cardsToPass)
  const index = players.indexOf(player)
  return players[(game.round % 2 === 1 ? index + 1 : index + players.length - 1) % players.length]
}
