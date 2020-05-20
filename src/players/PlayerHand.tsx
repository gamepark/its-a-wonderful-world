import {css, keyframes} from '@emotion/core'
import {Hand, useAnimation} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio, width as cardWidth} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'
import Player from '../types/Player'
import {bottomMargin} from './DisplayedEmpire'
import {areasLeftPosition, cardsShift, getAreaCardBottom} from './DraftArea'

type Props = { player: Player, leftPosition: number }

const PlayerHand: FunctionComponent<Props> = ({player, leftPosition}) => {
  const chooseCardAnimation = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type === MoveType.ChooseDevelopmentCard && animation.move.playerId === player.empire)

  const getItemProps = (index: number) => ({
    ignore: player.hand[index] === chooseCardAnimation?.move.card && !chooseCardAnimation.undo,
    hoverStyle: css`transform: scale(1.5);`,
    drag: {
      item: developmentFromHand(player.hand[index]),
      disabled: !!player.chosenCard || player.hand.length === 1,
      animation: {seconds: chooseCardAnimation?.duration ?? 0.2}
    },
    css: player.hand[index] === chooseCardAnimation?.move.card ? css`z-index: 1000` : undefined,
    animation: chooseCardAnimation ? {
      seconds: chooseCardAnimation.duration,
      fromNeutralPosition: player.hand[index] === chooseCardAnimation?.move.card && chooseCardAnimation.undo
    } : undefined
  })

  const translateChosenCard = chooseCardAnimation ? chooseCardAnimation.undo ?
    translateFromDraftArea(player.draftArea.length, chooseCardAnimation.duration, leftPosition)
    : translateToDraftArea(player.draftArea.length, chooseCardAnimation.duration, leftPosition)
    : undefined

  return (
    <Hand css={playerHandStyle(leftPosition)} rotationOrigin={50} gapMaxAngle={0.72} sizeRatio={cardRatio} getItemProps={getItemProps}>
      {player.hand.map(card => <DevelopmentCard key={card} development={developmentCards[card]}
                                                css={[playerHandCardStyle, chooseCardAnimation?.move.card === card && translateChosenCard]}/>)}
    </Hand>
  )
}

export const playerHandStyle = (leftPosition: number) => css`
  width: ${cardWidth}%;
  height: ${cardHeight}%;
  bottom: ${bottomMargin}%;
  left: ${leftPosition}%;
`

export const playerHandCardStyle = css`
  height: 100%;
  width: 100%;
  transform-origin: bottom;
`

export const translateToDraftArea = (index: number, transitionDuration: number, leftPosition: number) => css`
  transform: translate(${(areasLeftPosition + index * cardsShift - leftPosition) * 100 / cardWidth}%, ${bottomMargin - getAreaCardBottom(1)}vh);
  transition: transform ${transitionDuration}s ease-in-out;
`

const translateFromDraftArea = (index: number, transitionDuration: number, leftPosition: number) => {
  const keyframe = keyframes`
    from {
      transform: translate(${(areasLeftPosition + index * cardsShift - leftPosition) * 100 / cardWidth}%, ${bottomMargin - getAreaCardBottom(1)}vh);
    }
  `
  return css`animation: ${keyframe} ${transitionDuration}s ease-in-out forwards;`
}

export default PlayerHand