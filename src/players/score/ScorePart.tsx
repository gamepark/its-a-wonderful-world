import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from '../../material/characters/Character'
import DevelopmentType from '../../material/developments/DevelopmentType'
import Images from '../../material/Images'
import {getComboVictoryPoints, getFlatVictoryPoints, getItemQuantity, getVictoryPointsMultiplier} from '../../Rules'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import VictoryPointsMultiplier from '../VictoryPointsMultiplier'

type Props = {
  player: Player | PlayerView
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
      <div css={scoreStyle}>{score}</div>
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  &:not(:first-of-type) {
    div:last-of-type:before {
      content: '+';
      display: block;
      position: absolute;
      right: 115%;
      font-size: 5vh;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`

const scoreStyle = css`
  background-image: url(${Images.scoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 5vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  padding: 0;
  width: 10vh;
  height: fit-content;
  text-align: center;
  margin-left: 4vh;
  margin-top: 2%;
`

const multiplierStyle = css`
  height: 40%;
  width: 0;
  margin-right: 15%;
  filter: drop-shadow(0 0 1px black);
  & img {
    filter: none;
  }
`

export default ScorePart