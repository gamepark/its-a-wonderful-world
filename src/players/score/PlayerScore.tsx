import {css, keyframes} from '@emotion/core'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {developmentTypes} from '../../material/developments/DevelopmentType'
import Images from '../../material/Images'
import {getScore} from '../../Rules'
import Theme, {LightTheme} from '../../Theme'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {fadeIn, gameOverDelay} from '../../util/Styles'
import ScorePart from './ScorePart'
import {characters} from '../../material/characters/Character'

type Props = {
  player: Player | PlayerView
  position: number
  displayScore: boolean
  setDisplayScore: (displayScore: boolean) => void
  animation: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerScore: FunctionComponent<Props> = ({player, position, displayScore, setDisplayScore, animation}) => {
  const {t} = useTranslation()
  const score = getScore(player)
  const theme = useTheme<Theme>()
  return (
    <div css={[style, topPosition(position), backgroundStyle(theme), animation && growAnimation, displayScore ? displayPlayerScore : hidePlayerScore]}>
      <button css={[arrowStyle(theme), animation && fadeInAnimation, displayScore ? arrowStandardStyle : arrowReverseStyle]} onClick={() => setDisplayScore(!displayScore)}
              title={displayScore ? t('Réduire les Scores') : t('Afficher les Scores')}/>
      <div css={scorePartStyle}>
        {developmentTypes.map(developmentType => <ScorePart key={developmentType} player={player} item={developmentType}/>)}
        {characters.map(character => <ScorePart key={character} player={player} item={character}/>)}
        <ScorePart player={player}/>
      </div>
      <div css={[scoreStyle, animation && fadeInAnimation, displayScore ? displayScoreStyle : hideScoreStyle, score !== 0 && displayScore && equalSign]}>{score}</div>
    </div>
  )
}

const style = css`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-radius: 2em 0 0 2em;
  width: auto;
  height: 17%;
  overflow: hidden;
  pointer-events: auto;
  transition: max-width 0.5s linear, background-color 1s ease-in;
`

const topPosition = (index: number) => css`
  top: ${(1 + index * 20.2)}%;
`

const backgroundStyle = (theme: Theme) => css`
  background-color: ${theme.color === LightTheme ? 'rgba(0, 0, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`

const revealScore = keyframes`
  from { max-width: 17em; }
  to { max-width: 100%; }
`

const growAnimation = css`
  animation: ${revealScore} ${gameOverDelay}s linear;
`

const displayPlayerScore = css`
  max-width: 100%;
`

const hidePlayerScore = css`
  max-width: 17em;
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
`

const fadeInAnimation = css`
  opacity: 0;
  animation: ${fadeIn} ${gameOverDelay/3}s ${gameOverDelay*2/3}s ease-in forwards;
`

const arrowStandardStyle = css`
  width: 8em;
  height: 10em;
`

const arrowReverseStyle = css`
  transform: scaleX(-1);
  width: 5em;
  height: 7em;
`

const scoreStyle = css`
  flex-shrink: 0;
  background-image: url(${Images.scoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 6em;
  filter: drop-shadow(0.05em 0.05em 0.1em black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.3em black;
  width: 1.8em;
  height: 1.67em;
  text-align: center;
  transition: margin 0.5s linear;
`

const displayScoreStyle = css`
  margin: 0 0.2em 0 0.8em;
`

const hideScoreStyle = css`
  margin: 0 0.2em 0 0;
`

const equalSign = css`
  &:before {
    content: '=';
    position: absolute;
    right: 110%;
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