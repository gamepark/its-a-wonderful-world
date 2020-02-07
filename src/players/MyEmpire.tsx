import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Hand, usePlay} from 'tabletop-game-workshop'
import {developmentFromHand} from '../drag-objects/DevelopmentFromHand'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import Empire from '../material/Empire'
import EmpireCard from '../material/empire-cards/EmpireCard'
import {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'

const MyEmpire: FunctionComponent<{ empire: Empire, player: Player }> = ({empire, player}) => {
  const play = usePlay()
  return (
    <Fragment>
      <EmpireCard empire={empire as Empire} position={bottomLeft}/>
      <DraftArea empire={empire} player={player}/>
      <ConstructionArea empire={empire} player={player}/>
      {player.constructedDevelopments.map((development, index) => <DevelopmentCard key={index} development={development} position={css`
        position:absolute;
        bottom: ${index * 2.6 + 14}vh;
        left: 10.8vh;
      `}/>)}
      <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65 / 100}
            onItemClick={index => play(chooseDevelopmentCard(empire, index))}
            draggable={index => ({item: developmentFromHand(index)})}
            position={css`
              bottom: 3vh;
              right: ${player.hand.length * 7 - 6}vh;
            `}>
        {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
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