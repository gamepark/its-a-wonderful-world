import {css, keyframes} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import boardArrow from '../../material/board/arrow-white-2.png'
import Character from '../../material/characters/Character'
import DevelopmentType from '../../material/developments/DevelopmentType'
import ScoreIcon from '../../material/score-icon.png'
import {getScore} from '../../Rules'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {opacity} from '../../util/Styles'
import ScorePart from './ScorePart'

type Props = {
  player: Player | PlayerView
  position: number
  displayScore: boolean
  setDisplayScore: (displayScore: boolean) => void
} & React.HTMLAttributes<HTMLDivElement>

const PlayerScore: FunctionComponent<Props> = ({player, position, displayScore, setDisplayScore}) => {
  const {t} = useTranslation()
  const score = getScore(player)

  return (
    <div css={[style(position), displayScore ? displayPlayerScore : hidePlayerScore]}>
      <button css={[arrowStyle, displayScore ? arrowStandardStyle : arrowReverseStyle]} onClick={() => setDisplayScore(!displayScore)}
              title={displayScore ? t('Réduire les Scores') : t('Afficher les Scores')}/>
      <div css={scorePartStyle}>
        {Object.values(DevelopmentType).map(developmentType => <ScorePart key={developmentType} player={player} item={developmentType}/>)}
        {Object.values(Character).map(character => <ScorePart key={character} player={player} item={character}/>)}
        <ScorePart player={player}/>
      </div>
      <div css={[scoreStyle, displayScore ? displayScoreStyle : hideScoreStyle, score !== 0 && displayScore && equalSign]}>{score}</div>
    </div>
  )
}

const style = (index: number) => css`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background: #05214a;
  border-radius: 2vh 0 0 2vh;
  opacity: 0.95;
  width: auto;
  height: 17%;
  overflow: hidden;
  top: ${(1 + index * 20.2)}%;
  transition: max-width 0.5s linear;
  animation: ${revealScore} 10s linear;
`
const displayPlayerScore = css`
  max-width: 100%;
`
const hidePlayerScore = css`
  max-width: 17vh;
`

const revealScore = keyframes`
  from {
    max-width: 17vh;
  }
  to {
    max-width: 100%;
  }
`

const arrowStyle = css`
  flex-shrink: 0;
  position: relative;
  max-height: 100%;
  background-image: url(${boardArrow});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  z-index: 6;
  &:focus {
    outline: 0;
  }
  &:hover {
    cursor: pointer;
  }
  transition: all 0.5s linear;
  opacity: 0;
  animation: ${opacity(1)} 5s ease-in;
  animation-delay: 6s;
  animation-fill-mode: forwards;
`

const arrowStandardStyle = css`
  width: 8vh;
  height: 10vh;
`

const arrowReverseStyle = css`
  transform: scaleX(-1);
  width: 5vh;
  height: 7vh;
`

const scoreStyle = css`
  flex-shrink: 0;
  background-image: url(${ScoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 6vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  width: 11vh;
  height: 10vh;
  text-align: center;
  transition: margin 0.5s linear;
  opacity: 0;
  animation: ${opacity(1)} 4s ease-in;
  animation-delay: 6s;
  animation-fill-mode: forwards;
`
const displayScoreStyle = css`
  margin: 0 1vh 0 4vh;
`

const hideScoreStyle = css`
  margin: 0 1vh 0 0;
`

const equalSign = css`
  &:before {
    content: '=';
    position: absolute;
    right: 110%;
    font-size: 5vh;
    top: 50%;
    transform: translateY(-50%);
  }
`

const scorePartStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  overflow:hidden;
  height:100%; 
`


export default PlayerScore