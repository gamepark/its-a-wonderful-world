import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Hand, useAnimation, useGame, usePlayerId} from 'tabletop-game-workshop'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import ItsAWonderfulWorld, {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio, width as cardWidth} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import {DiscardLeftoverCardsView} from '../moves/DiscardLeftoverCards'
import MoveType from '../moves/MoveType'
import {constructedCardLeftMargin} from './ConstructedCardsArea'
import {areasLeftPosition, cardsShift, getAreaCardBottom} from './DraftArea'
import {playerPanelWidth} from './PlayerPanel'

export const bottomMargin = 3

const handLeftPosition = (players: number) => {
  if (players <= 2) {
    return 50 + (constructedCardLeftMargin + 1) / 2
  } else {
    return 50 + (constructedCardLeftMargin + 1) / 2 - (playerPanelWidth + 1) / 2
  }
}

const position = (players: number) => css`
  width: ${cardWidth}%;
  height: ${cardHeight}%;
  bottom: ${bottomMargin}%;
  left: ${handLeftPosition(players)}%;
`

const developmentCardStyle = css`
  height: 100%;
  width: 100%;
`

const translateToDraftArea = (index: number, transitionDuration: number, players: number) => css`
  transform: translate(${(areasLeftPosition + index * cardsShift - handLeftPosition(players)) * 100 / cardWidth}%, ${bottomMargin - getAreaCardBottom(1)}vh);
  transition: transform ${transitionDuration}s ease-in-out;
`

const translateToDiscard = (transitionDuration: number) => css`
  transform: translate(-58vh, -69vh) rotate(90deg) scale(0.66);
  transition: transform ${transitionDuration}s ease-in-out;
`

const hoverScaleFromBottom = css`transform-origin: bottom;`

const PlayerHand: FunctionComponent<{ player: Player }> = ({player}) => {
  const players = useGame<ItsAWonderfulWorld>().players.length
  const playerId = usePlayerId()
  const choosingDevelopment = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type == MoveType.ChooseDevelopmentCard && animation.move.playerId == player.empire)
  const discardingLeftoverCards = useAnimation<DiscardLeftoverCardsView>(animation => animation.move.type == MoveType.DiscardLeftoverCards)
  const getDevelopmentCardCSS = (card: number) => {
    const css = [developmentCardStyle]
    if (choosingDevelopment && choosingDevelopment.move.card == card) {
      css.push(translateToDraftArea(player.draftArea.length, choosingDevelopment.duration, players))
    } else if (discardingLeftoverCards) {
      css.push(translateToDiscard(discardingLeftoverCards.duration))
    } else {
      css.push(hoverScaleFromBottom)
    }
    return css
  }
  return (
    <Hand position={position(players)} rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={cardRatio}
          draggable={index => ({
            item: developmentFromHand(player.hand[index]), canDrag: player.empire == playerId && player.chosenCard == undefined && player.hand.length > 1,
            transitionDuration: choosingDevelopment ? choosingDevelopment.duration : 0.2
          })}
          removing={index => choosingDevelopment && choosingDevelopment.move.card == player.hand[index] || discardingLeftoverCards != null}
          transition={choosingDevelopment?.duration || discardingLeftoverCards?.duration}
          itemHoverStyle={css`transform: scale(1.5);`}>
      {player.hand.map(card => <DevelopmentCard key={card} development={developmentCards[card]} css={getDevelopmentCardCSS(card)}/>)}
    </Hand>
  )
}

export default PlayerHand