import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Player} from '../ItsAWonderfulWorld'
import Empire from '../material/Empire'
import EmpireCard from '../material/empire-cards/EmpireCard'

const topRight = css`
  position: absolute;
  top: 10vh;
  right: 3vh;
`

const OtherPlayerEmpire: FunctionComponent<{ empire: Empire, player: Player }> = ({empire}) => {
  return (
    <EmpireCard empire={empire} position={topRight}/>
  )
}

export default OtherPlayerEmpire