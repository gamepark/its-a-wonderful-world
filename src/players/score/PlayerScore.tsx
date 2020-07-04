import {css, keyframes} from '@emotion/core'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character from '../../material/characters/Character'
import DevelopmentType from '../../material/developments/DevelopmentType'
import Images from '../../material/Images'
import {getScore} from '../../Rules'
import Theme, {LightTheme} from '../../Theme'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {fadeIn} from '../../util/Styles'
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
  const theme = useTheme<Theme>()
  return (
    <div css={[style(position, theme), displayScore ? displayPlayerScore : hidePlayerScore]}>
      <button css={[arrowStyle(theme), displayScore ? arrowStandardStyle : arrowReverseStyle]} onClick={() => setDisplayScore(!displayScore)}
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

const style = (index: number, theme: Theme) => css`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: ${theme.color === LightTheme ? 'rgba(0, 0, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 2vh 0 0 2vh;
  width: auto;
  height: 17%;
  overflow: hidden;
  top: ${(1 + index * 20.2)}%;
  transition: max-width 0.5s linear, background-color 1s ease-in;
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

const arrowStyle = (theme: Theme) => css`
  flex-shrink: 0;
  position: relative;
  max-height: 100%;
  background-image: url(${theme.color === LightTheme ? Images.arrowWhite : Images.arrowOrange});
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
  animation: ${fadeIn} 5s 6s ease-in forwards;
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
  background-image: url(${Images.scoreIcon});
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
  animation: ${fadeIn} 4s 6s ease-in forwards;
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