import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Hand, usePlay} from 'tabletop-game-workshop/dist'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import Empire from '../material/Empire'
import EmpireCard from '../material/empire-cards/EmpireCard'
import {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'

const bottomRight = css`
  position: absolute;
  bottom: 1vh;
  right: 1vh;
`

const MyEmpire: FunctionComponent<{ empire: Empire, player: Player }> = ({empire, player}) => {
  const play = usePlay()
  return (
    <Fragment>
      <EmpireCard empire={empire as Empire} position={bottomRight}/>
      <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65 / 100}
            onItemClick={index => play(chooseDevelopmentCard(empire, index))}
            position={css`
              bottom: 3vh;
              left: calc(50% - 20vh);
            `}>
        {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
      </Hand>
    </Fragment>
  )
}

export default MyEmpire