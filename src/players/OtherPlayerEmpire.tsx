import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Hand} from 'tabletop-game-workshop/dist'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import Empire from '../material/Empire'
import EmpireCard from '../material/empire-cards/EmpireCard'

const topLeft = css`
  position: absolute;
  top: 8vh;
  left: 1vh;
  transform: rotate(180deg);
`

const OtherPlayerEmpire: FunctionComponent<{ empire: Empire, player: Player }> = ({empire, player}) => {
  return (
    <Fragment>
      <EmpireCard empire={empire as Empire} position={topLeft}/>
      <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65 / 100} position={css`
            transform: rotate(180deg) scale(0.5);
            top: 10vh;
            left: calc(50% - 10vh);
          `}>
        {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
      </Hand>
    </Fragment>
  )
}

export default OtherPlayerEmpire