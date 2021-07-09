import Character from './material/Character'
import {getCardDetails} from './material/Developments'
import DevelopmentType from './material/DevelopmentType'
import Empires from './material/Empires'
import Player from './Player'
import PlayerView from './PlayerView'

export type ScoreMultiplier = DevelopmentType | Character
export type ComboVictoryPoints = { quantity: number, per: ScoreMultiplier | ScoreMultiplier[] }
export type VictoryPoints = number | ComboVictoryPoints

export type ScoringDetails = {
  flatVictoryPoints: number
  scoreMultipliers: { [key in ScoreMultiplier]: number }
  comboVictoryPoints: ComboVictoryPoints[]
}

export function getPlayerScore(player: Player | PlayerView): number {
  const scoringDetails = getScoringDetails(player)
  return getScoreFromScoringDetails(scoringDetails)
}

export function getScoringDetails(player: Player | PlayerView, ignoreBaseCharacterValue: boolean = false) {
  const scoringDetails: ScoringDetails = {
    flatVictoryPoints: 0,
    scoreMultipliers: {
      [DevelopmentType.Structure]: 0,
      [DevelopmentType.Vehicle]: 0,
      [DevelopmentType.Research]: 0,
      [DevelopmentType.Project]: 0,
      [DevelopmentType.Discovery]: 0,
      [Character.Financier]: player.characters[Character.Financier],
      [Character.General]: player.characters[Character.General]
    },
    comboVictoryPoints: ignoreBaseCharacterValue ? [] : [{quantity: 1, per: Character.Financier}, {quantity: 1, per: Character.General}]
  }
  const empireScoring = Empires[player.empire][player.empireSide].victoryPoints
  if (empireScoring) {
    scoringDetails.comboVictoryPoints.push(empireScoring)
  }
  for (const constructedDevelopment of player.constructedDevelopments) {
    const development = getCardDetails(constructedDevelopment)
    scoringDetails.scoreMultipliers[development.type]++
    if (typeof development.victoryPoints === 'number') {
      scoringDetails.flatVictoryPoints += development.victoryPoints
    } else if (development.victoryPoints) {
      const newCombo = development.victoryPoints
      const existingCombo = scoringDetails.comboVictoryPoints.find(combo => isSameCombo(combo, newCombo))
      if (existingCombo) {
        existingCombo.quantity += newCombo.quantity
      } else {
        scoringDetails.comboVictoryPoints.push(development.victoryPoints)
      }
    }
  }
  return scoringDetails
}

export function getScoreFromScoringDetails(scoringDetails: ScoringDetails) {
  return scoringDetails.flatVictoryPoints + scoringDetails.comboVictoryPoints.reduce((sum, combo) => sum + getComboValue(combo, scoringDetails.scoreMultipliers), 0)
}

function isSameCombo(combo: ComboVictoryPoints, newCombo: ComboVictoryPoints) {
  if (combo === newCombo) return true
  return Array.isArray(combo) && Array.isArray(newCombo) && combo.length === newCombo.length && newCombo.every(combo.includes)
}

export function getComboValue(combo: ComboVictoryPoints, scoreMultipliers: { [key in ScoreMultiplier]: number }) {
  return combo.quantity * getComboMultiplier(combo, scoreMultipliers)
}

export function getComboMultiplier(combo: ComboVictoryPoints, scoreMultipliers: { [key in ScoreMultiplier]: number }) {
  if (Array.isArray(combo.per)) {
    return Math.min(...combo.per.map(scoreMultiplier => scoreMultipliers[scoreMultiplier]))
  } else {
    return scoreMultipliers[combo.per]
  }
}