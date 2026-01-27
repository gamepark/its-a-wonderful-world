/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { getScoreFromScoringDetails, getScoringDetails } from '@gamepark/its-a-wonderful-world/Scoring'
import { useGame } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { HTMLAttributes, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { arrowWhite, scoreIcon } from '../Images'
import { ScorePart } from './ScorePart'

const gameOverDelay = 10

type Props = {
  playerId: Empire
  displayScore: boolean
  setDisplayScore: (displayScore: boolean) => void
  animation: boolean
} & HTMLAttributes<HTMLDivElement>

export const PlayerScore = ({ playerId, displayScore, setDisplayScore, animation, ...props }: Props) => {
  const { t } = useTranslation()
  const game = useGame<MaterialGame>()
  const scoringDetails = useMemo(() => {
    if (!game) return undefined
    const details = getScoringDetails(game, playerId)
    details.comboVictoryPoints.sort((comboA, comboB) =>
      Array.isArray(comboA.per) ? 1 : Array.isArray(comboB.per) ? -1 : comboA.per - comboB.per
    )
    return details
  }, [game, playerId])

  if (!scoringDetails) return null

  const score = getScoreFromScoringDetails(scoringDetails)

  return (
    <div {...props}>
      <div css={contentStyle}>
        <button
          css={[arrowStyle, animation && fadeInAnimation, displayScore ? arrowStandardStyle : arrowReverseStyle]}
          onClick={() => setDisplayScore(!displayScore)}
          title={displayScore ? t('Hide Scores') : t('Display Scores')}
        />
        <div css={[scorePartsWrapperStyle, animation && growAnimation, displayScore ? displayParts : hideParts]}>
          <div css={scorePartsInnerStyle}>
            {scoringDetails.comboVictoryPoints.map((combo, index) => (
              <ScorePart key={index} combo={combo} scoreMultipliers={scoringDetails.scoreMultipliers} />
            ))}
            <ScorePart score={scoringDetails.flatVictoryPoints} />
          </div>
        </div>
        <div css={[totalScoreStyle, animation && fadeInAnimation, displayScore ? displayTotalStyle : hideTotalStyle, score !== 0 && displayScore && equalSign]}>
          {score}
        </div>
      </div>
    </div>
  )
}

const contentStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-radius: 2em 0 0 2em;
  height: 100%;
  pointer-events: auto;
  background-color: rgba(0, 0, 30, 0.8);
  font-size: 0.48em;
`

const scorePartsWrapperStyle = css`
  overflow: hidden;
  height: 100%;
  transition: max-width 0.5s linear;
`

const revealScore = keyframes`
  from {
    max-width: 0;
  }
  to {
    max-width: 200em;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const growAnimation = css`
  animation: ${revealScore} ${gameOverDelay}s linear;
`

const displayParts = css`
  max-width: 200em;
`

const hideParts = css`
  max-width: 0;
`

const scorePartsInnerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  white-space: nowrap;
`

const arrowStyle = css`
  flex-shrink: 0;
  position: relative;
  max-height: 100%;
  background-image: url(${arrowWhite});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;

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

const totalScoreStyle = css`
  flex-shrink: 0;
  background-image: url(${scoreIcon});
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

const displayTotalStyle = css`
  margin: 0 0.2em 0 0.8em;
`

const hideTotalStyle = css`
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
