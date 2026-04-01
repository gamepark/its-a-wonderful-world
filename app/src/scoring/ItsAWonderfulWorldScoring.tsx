/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { ItsAWonderfulWorldRules } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldRules'
import { Character, isCharacter } from '@gamepark/its-a-wonderful-world/material/Character'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import {
  ComboVictoryPoints,
  getComboValue,
  getScoreFromScoringDetails,
  getScoringDetails,
  ScoreMultiplier
} from '@gamepark/its-a-wonderful-world/Scoring'
import { ScoringDescription } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { characterIcons, developmentTypeIcons, scoreIcon } from '../panels/Images'

type ScoringKey = string

const FLAT_KEY = 'flat'
const TOTAL_KEY = 'total'
const TB1_KEY = 'tb:1'
const TB2_KEY = 'tb:2'

function comboKey(per: ScoreMultiplier | ScoreMultiplier[]): string {
  if (Array.isArray(per)) return `combo:${[...per].sort().join(',')}`
  return `combo:${per}`
}

function parseComboKey(key: string): ScoreMultiplier | ScoreMultiplier[] {
  const value = key.substring(6) // remove "combo:"
  if (value.includes(',')) {
    return value.split(',').map(Number) as ScoreMultiplier[]
  }
  return Number(value) as ScoreMultiplier
}

export class ItsAWonderfulWorldScoring implements ScoringDescription<Empire, ItsAWonderfulWorldRules, ScoringKey> {

  getScoringKeys(rules: ItsAWonderfulWorldRules): ScoringKey[] {
    const players = rules.players
    const allComboKeys = new Set<string>()

    for (const player of players) {
      const details = getScoringDetails(rules.game, player)
      for (const combo of details.comboVictoryPoints) {
        allComboKeys.add(comboKey(combo.per))
      }
    }

    // Sort combo keys: single combos first (by value), then multi-combos
    const sortedComboKeys = [...allComboKeys].sort((a, b) => {
      const aMulti = a.includes(',')
      const bMulti = b.includes(',')
      if (aMulti !== bMulti) return aMulti ? 1 : -1
      return a.localeCompare(b, undefined, { numeric: true })
    })

    return [
      FLAT_KEY,
      ...sortedComboKeys,
      TOTAL_KEY,
      TB1_KEY,
      TB2_KEY
    ]
  }

  getScoringHeader(key: ScoringKey, _rules: ItsAWonderfulWorldRules) {
    if (key === FLAT_KEY) {
      return <img src={scoreIcon} alt="VP" css={headerIconStyle} />
    }
    if (key === TOTAL_KEY) {
      return <span css={totalHeaderStyle}><img src={scoreIcon} alt="Score" css={headerIconStyle} /> =</span>
    }
    if (key === TB1_KEY) {
      return <Trans i18nKey="score.tiebreaker.developments" defaults="Tie-breaker #1: # of developments" />
    }
    if (key === TB2_KEY) {
      return <Trans i18nKey="score.tiebreaker.characters" defaults="Tie-breaker #2: # of characters" />
    }

    // Combo key
    const per = parseComboKey(key)
    const items = Array.isArray(per) ? per : [per]
    return <span css={comboHeaderStyle}>
      <img src={scoreIcon} alt="VP" css={headerIconStyle} />
      <span css={multiplierSignStyle}>×</span>
      {items.map(item =>
        isCharacter(item)
          ? <img key={item} src={characterIcons[item as Character]} alt="" css={[headerIconStyle, characterIconStyle]} />
          : <img key={item} src={developmentTypeIcons[item as DevelopmentType]} alt="" css={headerIconStyle} />
      )}
    </span>
  }

  getScoringPlayerData(key: ScoringKey, player: Empire, rules: ItsAWonderfulWorldRules) {
    if (key === TOTAL_KEY) {
      const details = getScoringDetails(rules.game, player)
      return <strong>{getScoreFromScoringDetails(details)}</strong>
    }

    if (key === TB1_KEY) {
      return rules.material(MaterialType.DevelopmentCard)
        .location(LocationType.ConstructedDevelopments)
        .player(player).length
    }

    if (key === TB2_KEY) {
      return rules.material(MaterialType.CharacterToken)
        .player(player).getQuantity()
    }

    const details = getScoringDetails(rules.game, player)

    if (key === FLAT_KEY) {
      return details.flatVictoryPoints || null
    }

    // Combo key
    const combo = details.comboVictoryPoints.find(c => comboKey(c.per) === key)
    if (!combo) return null
    return <ComboCell combo={combo} scoreMultipliers={details.scoreMultipliers} />
  }
}

const ComboCell = ({ combo, scoreMultipliers }: {
  combo: ComboVictoryPoints
  scoreMultipliers: { [key in ScoreMultiplier]: number }
}) => {
  const value = getComboValue(combo, scoreMultipliers)
  if (!value) return null
  return <span css={comboCellStyle}>
    <span css={comboDetailStyle}>{combo.quantity} x {Array.isArray(combo.per)
      ? Math.min(...combo.per.map(p => scoreMultipliers[p]))
      : scoreMultipliers[combo.per]
    }</span>
    <span> = {value}</span>
  </span>
}

const headerIconStyle = css`
  height: 1.5em;
  width: 1.5em;
  object-fit: contain;
  vertical-align: middle;
  border-radius: 0.2em;
`

const characterIconStyle = css`
  border-radius: 50%;
`

const multiplierSignStyle = css`
  font-weight: bold;
  font-size: 1.1em;
  margin: 0 0.1em;
`

const comboHeaderStyle = css`
  display: flex;
  align-items: center;
  gap: 0.2em;
`

const totalHeaderStyle = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  font-weight: bold;
`

const comboCellStyle = css`
  white-space: nowrap;
`

const comboDetailStyle = css`
  opacity: 0.7;
  font-size: 0.85em;
`
