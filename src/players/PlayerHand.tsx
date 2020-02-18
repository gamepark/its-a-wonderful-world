import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Hand, useAnimation} from 'tabletop-game-workshop'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, width as cardWidth} from '../material/developments/DevelopmentCard'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import {DiscardLeftoverCardsView} from '../moves/DiscardLeftoverCards'
import MoveType from '../moves/MoveType'
import {constructedCardLeftMargin} from './ConstructedCardsArea'

export const bottomMargin = 3

const PlayerHand: FunctionComponent<{ player: Player, margin: number, areaBorders: number }> = ({player, margin, areaBorders}) => {
  const choosingDevelopment = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type == MoveType.ChooseDevelopmentCard && animation.move.playerId == player.empire)
  const discardingLeftoverCards = useAnimation<DiscardLeftoverCardsView>(animation => animation.move.type == MoveType.DiscardLeftoverCards)
  return (
    <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={cardHeight / cardWidth}
          draggable={index => ({item: developmentFromHand(index), transitionDuration: choosingDevelopment ? choosingDevelopment.duration : 0.2})}
          removing={index => choosingDevelopment && choosingDevelopment.move.cardIndex == index || discardingLeftoverCards != null}
          transition={choosingDevelopment?.duration || discardingLeftoverCards?.duration}
          itemHoverStyle={css`transform: scale(1.5);`}
          position={css`
            bottom: ${bottomMargin}vh;
            left: calc(50vw + ${(constructedCardLeftMargin + margin) / 2}vh);
          `}>
      {player.hand.map((development, index) =>
        <DevelopmentCard key={[player.hand.length, index].join('-')} development={development}
                         css={choosingDevelopment && choosingDevelopment.move.cardIndex == index && css`
          transform: translate(calc(${(constructedCardLeftMargin + margin) / 2 + cardWidth + margin * 2 + areaBorders + player.draftArea.length * (cardWidth + margin)}vh - 50vw), -${cardHeight + margin * 2 + areaBorders}vh);
          transition: transform ${choosingDevelopment.duration}s ease-in-out;
        ` || discardingLeftoverCards && css`
          transform: translate(-58vh, -69vh) rotate(90deg) scale(0.66);
          transition: transform ${discardingLeftoverCards.duration}s ease-in-out;
        ` || css`transform-origin: bottom;`}/>)}
    </Hand>
  )
}

export default PlayerHand