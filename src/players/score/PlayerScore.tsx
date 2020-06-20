import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from '../../material/characters/Character'
import DevelopmentType from '../../material/developments/DevelopmentType'
import ScoreIcon from '../../material/score-icon.png'
import {getScore} from '../../Rules'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import ScorePart from './ScorePart'

type Props = {
  player: Player | PlayerView
} & React.HTMLAttributes<HTMLDivElement>

const PlayerScore: FunctionComponent<Props> = ({player}) => {
  const score = getScore(player)
  return (
    <div css={style}>
      {Object.values(DevelopmentType).map(developmentType => <ScorePart key={developmentType} player={player} item={developmentType}/>)}
      {Object.values(Character).map(character => <ScorePart key={character} player={player} item={character}/>)}
      <ScorePart player={player}/>
      <div css={[scoreStyle, score !== 0 && equalSign]}>{score}</div>
    </div>
  )
}

const style = css`
  position: absolute;
  right: 110%;
  top: 60%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
`

const scoreStyle = css`
  background-image: url(${ScoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 7vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  padding: 1vh;
  width: 15vh;
  text-align: center;
  margin-left: 5vh;
`

const equalSign = css`
  &:before {
    content: '=';
    position: absolute;
    right: 100%;
    font-size: 5vh;
    top: 50%;
    transform: translateY(-50%);
  }
`

export default PlayerScore