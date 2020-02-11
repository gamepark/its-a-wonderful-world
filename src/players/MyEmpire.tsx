import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Hand, useAnimation, usePlay} from 'tabletop-game-workshop'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import EmpireCard from '../material/empire-cards/EmpireCard'
import ChooseDevelopmentCard, {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'
import {DiscardLeftoverCardsView} from '../moves/DiscardLeftoverCards'
import MoveType from '../moves/MoveType'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import RecyclingDropArea from './RecyclingDropArea'

const MyEmpire: FunctionComponent<{ player: Player }> = ({player}) => {
  const play = usePlay()
  const choosingDevelopment = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type == MoveType.ChooseDevelopmentCard && animation.move.playerId == player.empire)
  const discardingLeftoverCards = useAnimation<DiscardLeftoverCardsView>(animation => animation.move.type == MoveType.DiscardLeftoverCards)
  return (
    <Fragment>
      <EmpireCard empire={player.empire} position={bottomLeft}/>
      <DraftArea player={player}/>
      <ConstructionArea player={player}/>
      <RecyclingDropArea empire={player.empire}/>
      {player.constructedDevelopments.map((development, index) => <DevelopmentCard key={index} development={development} position={css`
        position:absolute;
        bottom: ${index * 2.6 + 14}vh;
        left: 10.8vh;
      `}/>)}
      <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65 / 100}
            onItemClick={index => play(chooseDevelopmentCard(player.empire, index))}
            draggable={index => ({item: developmentFromHand(index), transitionDuration: choosingDevelopment ? choosingDevelopment.duration : 0.2})}
            removing={index => choosingDevelopment && choosingDevelopment.move.cardIndex == index || discardingLeftoverCards != null}
            transition={choosingDevelopment?.duration || discardingLeftoverCards?.duration}
            position={css`
              bottom: 3vh;
              right: ${player.hand.length * 7 - 6}vh;
            `}>
        {player.hand.map((development, index) => <DevelopmentCard key={[player.hand.length, index].join('-')} development={development} position={choosingDevelopment && choosingDevelopment.move.cardIndex == index && css`
          transform: translate(calc(-100vw + ${player.hand.length * 7 + 21 + (player.draftArea.length + 1) * 15.3}vh), 1vh);
          transition: transform ${choosingDevelopment.duration}s ease-in-out;
        ` || discardingLeftoverCards && css`
          transform: translate(-58vh, -69vh) rotate(90deg) scale(0.66);
          transition: transform ${discardingLeftoverCards.duration}s ease-in-out;
        `}/>)}
      </Hand>
    </Fragment>
  )
}

const bottomLeft = css`
  position: absolute;
  bottom: 1vh;
  left: 1vh;
`

export default MyEmpire