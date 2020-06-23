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
  player: Player | PlayerView,
  displayScore:boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerScore: FunctionComponent<Props> = ({player,displayScore}) => {
  const score = getScore(player)
  return (
    <div css={[style, !displayScore && hidePlayerScore]}>
      {displayScore &&
        <>
        {Object.values(DevelopmentType).map(developmentType => <ScorePart key={developmentType} player={player} item={developmentType}/>)}
        {Object.values(Character).map(character => <ScorePart key={character} player={player} item={character}/>)}
        <ScorePart player={player}/>
        </>
      }
      <div css={[scoreStyle, score !== 0 && displayScore && equalSign]}>{score}</div>
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background:#333;
  border-radius:2vh 0 0 2vh;
  opacity:0.95;
  margin: 1.2vh 0 1.6vh 0;
  padding: 6vh 0 0.5vh 7vh;
  transition:margin 0.3s ease-in-out,padding 0.3s ease-in-out;
  width:auto;
`
const hidePlayerScore = css`
  margin: 3.6vh 0 3.6vh 0;
  padding: 1vh 0 1vh 0vh;
  transition:margin 0.3s ease-in-out,padding 0.3s ease-in-out;
`

const scoreStyle = css`
  background-image: url(${ScoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 6vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  padding: 1vh;
  width: 12vh;
  text-align: center;
  margin-left: 4vh;
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