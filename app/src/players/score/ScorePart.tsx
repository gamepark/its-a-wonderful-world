/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {ComboVictoryPoints, getComboMultiplier, getComboValue, ScoreMultiplier} from '@gamepark/its-a-wonderful-world/Scoring'
import {HTMLAttributes} from 'react'
import Images from '../../material/Images'
import VictoryPointsMultiplier from '../VictoryPointsMultiplier'

type Props = {
  combo?: ComboVictoryPoints
  scoreMultipliers?: { [key in ScoreMultiplier]: number }
  score?: number
} & HTMLAttributes<HTMLDivElement>

export default function ScorePart({combo, scoreMultipliers, score}: Props) {
  const isMultiCombo = combo && Array.isArray(combo.per) && combo.per.length > 1
  return (
    <div css={style}>
      {combo && scoreMultipliers &&
      <VictoryPointsMultiplier css={[multiplierStyle, isMultiCombo && comboStyle]} combo={combo} quantity={getComboMultiplier(combo, scoreMultipliers!)}/>}
      <div css={scoreStyle}>{score ?? getComboValue(combo!, scoreMultipliers!)}</div>
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
  width: 100%;
  justify-content: center;
  filter: drop-shadow(0 0 1px black);

  & img {
    filter: none;
  }
`

const comboStyle = css`
  & img {
    height: 70%
  }
`