import { MaterialGame } from '@gamepark/rules-api'
import { Empire } from './Empire'
import { Memory } from './ItsAWonderfulWorldMemory'
import { Character } from './material/Character'
import { Development, getDevelopmentDetails } from './material/Development'
import { DevelopmentType } from './material/DevelopmentType'
import { Empires } from './material/Empires'
import { EmpireSide } from './material/EmpireSide'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'

export type ScoreMultiplier = DevelopmentType | Character
export type ComboVictoryPoints = { quantity: number; per: ScoreMultiplier | ScoreMultiplier[] }
export type VictoryPoints = number | ComboVictoryPoints

export type ScoringDetails = {
  flatVictoryPoints: number
  scoreMultipliers: { [key in ScoreMultiplier]: number }
  comboVictoryPoints: ComboVictoryPoints[]
}

export function getScoringDetails(game: MaterialGame, playerId: Empire, ignoreBaseCharacterValue = false): ScoringDetails {
  // Count character tokens
  const characters = game.items[MaterialType.CharacterToken] ?? []
  const playerCharacters = characters.filter(
    (item) => item?.location?.type === LocationType.PlayerCharacters && item?.location?.player === playerId
  )
  const financierCount = playerCharacters
    .filter((item) => item?.id === Character.Financier)
    .reduce((sum, item) => sum + (item?.quantity ?? 1), 0)
  const generalCount = playerCharacters
    .filter((item) => item?.id === Character.General)
    .reduce((sum, item) => sum + (item?.quantity ?? 1), 0)

  const scoringDetails: ScoringDetails = {
    flatVictoryPoints: 0,
    scoreMultipliers: {
      [DevelopmentType.Structure]: 0,
      [DevelopmentType.Vehicle]: 0,
      [DevelopmentType.Research]: 0,
      [DevelopmentType.Project]: 0,
      [DevelopmentType.Discovery]: 0,
      [Character.Financier]: financierCount,
      [Character.General]: generalCount
    },
    comboVictoryPoints: ignoreBaseCharacterValue ? [] : [
      { quantity: 1, per: Character.Financier },
      { quantity: 1, per: Character.General }
    ]
  }

  // Get empire card scoring from memory (empire cards are static items, not in game.items)
  const empireSide = (game.memory?.[Memory.EmpireSide] as EmpireSide | undefined) ?? EmpireSide.A
  const empireDetails = Empires[playerId][empireSide]
  if (empireDetails.victoryPoints) {
    const empireScoring = empireDetails.victoryPoints
    const existingCombo = scoringDetails.comboVictoryPoints.find((combo) => isSameCombo(combo, empireScoring))
    if (existingCombo) {
      existingCombo.quantity += empireScoring.quantity
    } else {
      scoringDetails.comboVictoryPoints.push({ ...empireScoring })
    }
  }

  // Get constructed developments
  const developments = game.items[MaterialType.DevelopmentCard] ?? []
  const constructedDevelopments = developments.filter(
    (item) => item?.location?.type === LocationType.ConstructedDevelopments && item?.location?.player === playerId
  )

  for (const card of constructedDevelopments) {
    if (!card) continue
    const development = card.id?.front as Development | undefined
    if (!development) continue

    const details = getDevelopmentDetails(development)
    scoringDetails.scoreMultipliers[details.type]++

    if (typeof details.victoryPoints === 'number') {
      scoringDetails.flatVictoryPoints += details.victoryPoints
    } else if (details.victoryPoints) {
      const newCombo = details.victoryPoints
      const existingCombo = scoringDetails.comboVictoryPoints.find((combo) => isSameCombo(combo, newCombo))
      if (existingCombo) {
        existingCombo.quantity += newCombo.quantity
      } else {
        scoringDetails.comboVictoryPoints.push({ ...newCombo })
      }
    }
  }

  return scoringDetails
}

export function getScoreFromScoringDetails(scoringDetails: ScoringDetails): number {
  return (
    scoringDetails.flatVictoryPoints +
    scoringDetails.comboVictoryPoints.reduce(
      (sum, combo) => sum + getComboValue(combo, scoringDetails.scoreMultipliers),
      0
    )
  )
}

export function getComboValue(
  combo: ComboVictoryPoints,
  scoreMultipliers: { [key in ScoreMultiplier]: number }
): number {
  return combo.quantity * getComboMultiplier(combo, scoreMultipliers)
}

export function getComboMultiplier(
  combo: ComboVictoryPoints,
  scoreMultipliers: { [key in ScoreMultiplier]: number }
): number {
  if (Array.isArray(combo.per)) {
    return Math.min(...combo.per.map((scoreMultiplier) => scoreMultipliers[scoreMultiplier]))
  } else {
    return scoreMultipliers[combo.per]
  }
}

function isSameCombo(combo: ComboVictoryPoints, newCombo: ComboVictoryPoints): boolean {
  if (combo.per === newCombo.per) return true
  if (Array.isArray(combo.per) && Array.isArray(newCombo.per)) {
    const combos = combo.per
    const newCombos = newCombo.per
    return combos.length === newCombos.length && newCombos.every((v) => combos.includes(v))
  }
  return false
}

export function getBestVictoryPointsCombo(game: MaterialGame, playerId: Empire): ComboVictoryPoints | undefined {
  const scoringDetails = getScoringDetails(game, playerId, true)
  let bestCombo: { combo: ComboVictoryPoints; score: number } | undefined = undefined
  for (const comboVictoryPoint of scoringDetails.comboVictoryPoints) {
    const score = getComboValue(comboVictoryPoint, scoringDetails.scoreMultipliers)
    if (!bestCombo || bestCombo.score < score) {
      bestCombo = { combo: comboVictoryPoint, score }
    }
  }
  return bestCombo?.combo
}
