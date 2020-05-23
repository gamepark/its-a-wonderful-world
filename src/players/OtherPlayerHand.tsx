import {css} from '@emotion/core'
import {Hand, useAnimation} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'
import PlayerView from '../types/PlayerView'
import {cardRatio, cardStyle} from '../util/Styles'
import {getChosenCardAnimation, handPosition, handPosition2Players, playerHandCardStyle} from './PlayerHand'

type Props = { player: PlayerView, players: number }

const OtherPlayerHand: FunctionComponent<Props> = ({player, players}) => {
  const chooseCardAnimation = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type === MoveType.ChooseDevelopmentCard && animation.move.playerId === player.empire)
  const position = players > 2 ? handPosition : handPosition2Players

  const getItemProps = (index: number) => {
    const chosen = chooseCardAnimation && index === player.hand - 1
    const undo = chooseCardAnimation?.undo
    return {
      ignore: chosen && !undo,
      css: chosen && !undo ? css`z-index: 10;` : undefined,
      animation: chooseCardAnimation ? {
        seconds: chooseCardAnimation.duration,
        fromNeutralPosition: chosen && undo
      } : undefined
    }
  }

  return (
    <Hand css={[position, cardStyle]} rotationOrigin={50} gapMaxAngle={0.72} sizeRatio={cardRatio} getItemProps={getItemProps}>
      {[...Array(player.hand)].map((_, index) => <DevelopmentCard key={'#' + index} css={[playerHandCardStyle,
        chooseCardAnimation && index === player.hand - 1 && getChosenCardAnimation(player, chooseCardAnimation, players)]}/>)}
    </Hand>
  )
}

export default OtherPlayerHand