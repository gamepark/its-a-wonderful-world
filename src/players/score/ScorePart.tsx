import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Player} from '../../ItsAWonderfulWorld'
import Character from '../../material/characters/Character'
import DevelopmentType from '../../material/developments/DevelopmentType'
import ScoreIcon from '../../material/score-icon.png'
import {getComboVictoryPoints, getFlatVictoryPoints, getItemQuantity, getVictoryPointsMultiplier} from '../../rules'
import VictoryPointsMultiplier from '../VictoryPointsMultiplier'

type Props = {
  player: Player
  item?: DevelopmentType | Character
} & React.HTMLAttributes<HTMLDivElement>

const ScorePart: FunctionComponent<Props> = ({player, item}) => {
  const score = item ? getComboVictoryPoints(player, item) : getFlatVictoryPoints(player)
  if (!score) {
    return null
  }
  return (
    <div css={style}>
      {item && <VictoryPointsMultiplier css={multiplierStyle} item={item} multiplier={getVictoryPointsMultiplier(player, item)}
                                        quantity={getItemQuantity(player, item)}/>}
      <div css={scoreStyle}>
        {score}
      </div>
    </div>
  )
}

const style = css`
  position: relative;
  &:not(:first-of-type) {
    div:last-of-type:before {
      content: '+';
      position: absolute;
      right: 115%;
      font-size: 5vh;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`

const scoreStyle = css`
  background-image: url(${ScoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 5vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black) drop-shadow(0.1vh 0.1vh 0.5vh black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  padding: 1vh;
  width: 7vh;
  height: fit-content;
  text-align: center;
  margin-left: 5vh;
`

const multiplierStyle = css`
  position: absolute;
  bottom: 100%;
  width: 50%;
  height: 45%;
  right: 5%;
`

export default ScorePart