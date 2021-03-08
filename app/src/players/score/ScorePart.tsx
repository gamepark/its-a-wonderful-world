/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import DevelopmentType from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {getComboVictoryPoints, getFlatVictoryPoints, getItemQuantity, getVictoryPointsMultiplier} from '@gamepark/its-a-wonderful-world/Rules'
import {FunctionComponent} from 'react'
import Images from '../../material/Images'
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
  font-size: 5em;
  filter: drop-shadow(0.05em 0.05em 0.1em black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.3em black;
  padding: 0;
  width: 1.67em;
  height: fit-content;
  text-align: center;
  margin-left: 0.8em;
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