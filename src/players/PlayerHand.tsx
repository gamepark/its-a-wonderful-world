import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Hand, useAnimation} from 'tabletop-game-workshop'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, width as cardWidth, ratio as cardRatio} from '../material/developments/DevelopmentCard'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import {DiscardLeftoverCardsView} from '../moves/DiscardLeftoverCards'
import MoveType from '../moves/MoveType'
import {constructedCardLeftMargin} from './ConstructedCardsArea'
import {areasLeftPosition, cardsShift, getAreaCardBottom} from './DraftArea'

export const bottomMargin = 3

const handLeftPosition = 50 + (constructedCardLeftMargin + 1) / 2

const position = css`
  height: ${cardHeight}%;
  bottom: ${bottomMargin}%;
  left: ${handLeftPosition}%;
`

const translateToDraftArea = (index: number, transitionDuration: number) => css`
  transform: translate(${(areasLeftPosition + index * cardsShift - handLeftPosition) * 100 / cardWidth}%, ${bottomMargin - getAreaCardBottom(1)}vh);
  transition: transform ${transitionDuration}s ease-in-out;
`

const translateToDiscard = (transitionDuration: number) => css`
  transform: translate(-58vh, -69vh) rotate(90deg) scale(0.66);
  transition: transform ${transitionDuration}s ease-in-out;
`

const hoverScaleFromBottom = css`transform-origin: bottom;`

const PlayerHand: FunctionComponent<{ player: Player }> = ({player}) => {
  const choosingDevelopment = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type == MoveType.ChooseDevelopmentCard && animation.move.playerId == player.empire)
  const discardingLeftoverCards = useAnimation<DiscardLeftoverCardsView>(animation => animation.move.type == MoveType.DiscardLeftoverCards)
  const getDevelopmentCardCSS = (index: number) => {
    if (choosingDevelopment && choosingDevelopment.move.cardIndex == index) {
      return translateToDraftArea(player.draftArea.length, choosingDevelopment.duration)
    } else if (discardingLeftoverCards) {
      return translateToDiscard(discardingLeftoverCards.duration)
    } else {
      return hoverScaleFromBottom
    }
  }
  return (
    <Hand position={position} rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={cardRatio}
          draggable={index => ({
            item: developmentFromHand(index), canDrag: !player.chosenCard, transitionDuration: choosingDevelopment ? choosingDevelopment.duration : 0.2
          })}
          removing={index => choosingDevelopment && choosingDevelopment.move.cardIndex == index || discardingLeftoverCards != null}
          transition={choosingDevelopment?.duration || discardingLeftoverCards?.duration}
          itemHoverStyle={css`transform: scale(1.5);`}>
      {player.hand.map((development, index) =>
        <DevelopmentCard key={[player.hand.length, index].join('-')} development={development}
                         css={getDevelopmentCardCSS(index)}/>)}
    </Hand>
  )
}

export default PlayerHand