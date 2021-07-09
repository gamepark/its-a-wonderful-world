/** @jsxImportSource @emotion/react */
import {css, keyframes, Theme, useTheme} from '@emotion/react'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {getScoreFromScoringDetails, getScoringDetails} from '@gamepark/its-a-wonderful-world/Scoring'
import {HTMLAttributes, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../../material/Images'
import {LightTheme} from '../../Theme'
import {fadeIn, gameOverDelay} from '../../util/Styles'
import ScorePart from './ScorePart'

type Props = {
  player: Player | PlayerView
  displayScore: boolean
  setDisplayScore: (displayScore: boolean) => void
  animation: boolean
} & HTMLAttributes<HTMLDivElement>

export default function PlayerScore({player, displayScore, setDisplayScore, animation, ...props}: Props) {
  const {t} = useTranslation()
  const scoringDetails = useMemo(() => {
    const scoringDetails = getScoringDetails(player)
    scoringDetails.comboVictoryPoints.sort((comboA, comboB) => Array.isArray(comboA.per) ? 1 : Array.isArray(comboB.per) ? -1 : comboA.per - comboB.per)
    return scoringDetails
  }, [player])
  const score = useMemo(() => getScoreFromScoringDetails(scoringDetails), [scoringDetails])
  const theme = useTheme()
  return (
    <div css={[style, backgroundStyle(theme), animation && growAnimation, displayScore ? displayPlayerScore : hidePlayerScore]} {...props}>
      <button css={[arrowStyle(theme), animation && fadeInAnimation, displayScore ? arrowStandardStyle : arrowReverseStyle]}
              onClick={() => setDisplayScore(!displayScore)}
              title={displayScore ? t('Hide Scores') : t('Display Scores')}/>
      <div css={scorePartStyle}>
        {scoringDetails.comboVictoryPoints.map((combo, index) => <ScorePart key={index} combo={combo} scoreMultipliers={scoringDetails.scoreMultipliers}/>)}
        <ScorePart score={scoringDetails.flatVictoryPoints}/>
      </div>
      <div
        css={[scoreStyle, animation && fadeInAnimation, displayScore ? displayScoreStyle : hideScoreStyle, score !== 0 && displayScore && equalSign]}>{score}</div>
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-radius: 2em 0 0 2em;
  width: auto;
  overflow: hidden;
  pointer-events: auto;
  transition: max-width 0.5s linear, background-color 1s ease-in;
`

const backgroundStyle = (theme: Theme) => css`
  background-color: ${theme.color === LightTheme ? 'rgba(0, 0, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`

const revealScore = keyframes`
  from {
    max-width: 17em;
  }
  to {
    max-width: 100%;
  }
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
  animation: ${fadeIn} ${gameOverDelay / 3}s ${gameOverDelay * 2 / 3}s ease-in forwards;
`

const arrowStandardStyle = css`
  width: 7.5em;
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
  overflow: hidden;
  height: 100%;
`