import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {Hand} from 'tabletop-game-workshop'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight} from '../material/developments/DevelopmentCard'
import {getEmpireName} from '../material/empires/EmpireCard'

const OtherPlayerEmpire: FunctionComponent<{ player: Player }> = ({player}) => {
  const {t} = useTranslation()
  return (
    <div css={style}>
      <h3 css={nameStyle}>{getEmpireName(t, player.empire)}</h3>
      <Hand position={handPosition} rotationOrigin={5000} nearbyMaxRotation={0.6} reverse>
        {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
        {player.chosenCard && <DevelopmentCard key={player.hand.length} development={player.chosenCard !== true && player.chosenCard}/>}
      </Hand>
      {!!player.draftArea.length && <DevelopmentCard development={player.draftArea[player.draftArea.length - 1]} css={lastPick}/>}
    </div>
  )
}

const style = css`
  position: absolute;
  top: 8vh;
  right: 1vh;
  width: 35.5vh;
  height: ${cardHeight + 6}vh;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1vh;
`

const nameStyle = css`
  position: absolute;
  top: 1vh;
  left: 1vh;
  margin: 0;
  font-size: 3vh;
  font-weight: bold;
`

const handPosition = css`
  position: absolute;
  left: 3vh;
  transform: rotate(180deg) translateY(4vh) scale(0.15);
`

const lastPick = css`
  position: absolute;
  right: 1vh;
  bottom: 1vh;
`

export default OtherPlayerEmpire