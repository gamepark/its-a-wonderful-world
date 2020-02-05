import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Hand} from 'tabletop-game-workshop/dist'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import Empire from '../material/Empire'
import EmpireCard from '../material/empire-cards/EmpireCard'

const topLeft = css`
  position: absolute;
  top: 1vh;
  left: 1vh;
  transform: rotate(180deg);
`

const OtherPlayerEmpire: FunctionComponent<{ empire: Empire, player: Player }> = ({empire, player}) => {
  return (
    <Fragment>
      <EmpireCard empire={empire} position={topLeft}/>
      {player.draftArea.map((development, index) => <DevelopmentCard key={index} development={development} position={css`
        position: absolute;
        top: 1vh;
        left: ${index * 15.3 + 24}vh;
        transform: rotate(180deg);
      `}/>)}
      <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65 / 100} position={css`
            transform: rotate(180deg);
            top: 3vh;
            right: ${player.hand.length * 7 - 6}vh;
          `}>
        {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
      </Hand>
    </Fragment>
  )
}

export default OtherPlayerEmpire