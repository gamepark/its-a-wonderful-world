import {Hand, useAnimation} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {PlayerView} from '../ItsAWonderfulWorld'
import DevelopmentCard, {ratio as cardRatio} from '../material/developments/DevelopmentCard'
import ChooseDevelopmentCard from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'
import {playerHandCardStyle, playerHandStyle, translateToDraftArea} from './PlayerHand'

type Props = { player: PlayerView, leftPosition: number }

const OtherPlayerHand: FunctionComponent<Props> = ({player, leftPosition}) => {
  const chooseCardAnimation = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type === MoveType.ChooseDevelopmentCard && animation.move.playerId === player.empire)

  return <Hand css={playerHandStyle(leftPosition)} rotationOrigin={50} gapMaxAngle={0.72} sizeRatio={cardRatio}
               getItemProps={index => ({ignore: index >= player.hand})}>
    {[...Array(player.hand)].map((_, index) => <DevelopmentCard key={'#' + index} css={playerHandCardStyle}/>)}
    {chooseCardAnimation && <DevelopmentCard css={[playerHandCardStyle,
      translateToDraftArea(player.draftArea.length, chooseCardAnimation.duration, leftPosition)]}/>}
  </Hand>
}

export default OtherPlayerHand