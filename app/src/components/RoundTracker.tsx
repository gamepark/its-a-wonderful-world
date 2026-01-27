/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { useFocusContext, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import roundTrackerRecto from '../images/round-tracker-recto.png'
import roundTrackerVerso from '../images/round-tracker-verso.png'

// Table boundaries (from GameDisplay)
const xMin = -37
const yMin = -18.5

// Position in table coordinates (next to ascension deck at x=-16, y=-16.2)
const x = -12
const y = -15.5

export const RoundTracker = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const round = rules?.remind<number>(Memory.Round) ?? 1
  const { focus } = useFocusContext()
  const playDown = focus?.highlight === true

  return (
    <div css={[containerStyle, playDown && playDownStyle]}>
      <img
        alt={t('Round-tracker token')}
        src={round % 2 ? roundTrackerRecto : roundTrackerVerso}
        css={roundTrackerStyle}
      />
      <span css={roundTextStyle}>{round}</span>
    </div>
  )
}

const playDownStyle = css`
  filter: brightness(0.5);
`

const containerStyle = css`
  position: absolute;
  left: ${x - xMin}em;
  top: ${y - yMin}em;
  transform: translate(-50%, -50%);
`

const roundTrackerStyle = css`
  height: 4.7em;
  filter: drop-shadow(0.1em 0.1em 0.4em black);
`

const roundTextStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2em;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
`
