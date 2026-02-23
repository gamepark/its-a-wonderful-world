import { sample } from 'es-toolkit'
import {
  isCreateItem,
  isCustomMoveType,
  isMoveItemType,
  MaterialGame,
  MaterialMove
} from '@gamepark/rules-api'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { ItsAWonderfulWorldRules } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldRules'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { CustomMoveType } from '@gamepark/its-a-wonderful-world/material/CustomMoveType'
import { Development, getCost, getDevelopmentDetails, getRemainingCost } from '@gamepark/its-a-wonderful-world/material/Development'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { Empires } from '@gamepark/its-a-wonderful-world/material/Empires'
import { EmpireSide } from '@gamepark/its-a-wonderful-world/material/EmpireSide'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { isResource, Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { getProduction, isProductionFactor, Production } from '@gamepark/its-a-wonderful-world/Production'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import {
  ComboVictoryPoints,
  getBestVictoryPointsCombo,
  getComboValue,
  getScoringDetails,
  ScoreMultiplier
} from '@gamepark/its-a-wonderful-world/Scoring'

// ─── Strategy ────────────────────────────────────────────────────────

type Strategy = {
  valuableTypes: DevelopmentType[]
  targetResources: Resource[]
  valuableCharacter: Character
  bestCombo?: ComboVictoryPoints
  /** The quantity from the empire combo (e.g. 3 for Aztec's "3 per Discovery") — scales strategy bonuses */
  empireComboQuantity: number
}

/**
 * Map a combo multiplier type to the development types that serve as multipliers,
 * and the character that typically accompanies that strategy.
 */
function getComboStrategy(per: ScoreMultiplier[]): { types: DevelopmentType[]; character: Character } {
  const hasFinancier = per.includes(Character.Financier as ScoreMultiplier)
  const hasGeneral = per.includes(Character.General as ScoreMultiplier)

  if (hasFinancier) return { types: [DevelopmentType.Structure, DevelopmentType.Project], character: Character.Financier }
  if (hasGeneral) return { types: [DevelopmentType.Structure, DevelopmentType.Vehicle], character: Character.General }
  if (per.includes(DevelopmentType.Discovery as ScoreMultiplier)) return { types: [DevelopmentType.Discovery], character: Character.General }
  if (per.includes(DevelopmentType.Project as ScoreMultiplier)) return { types: [DevelopmentType.Project], character: Character.Financier }
  if (per.includes(DevelopmentType.Research as ScoreMultiplier)) return { types: [DevelopmentType.Research], character: Character.Financier }
  if (per.includes(DevelopmentType.Vehicle as ScoreMultiplier)) return { types: [DevelopmentType.Vehicle], character: Character.General }
  if (per.includes(DevelopmentType.Structure as ScoreMultiplier)) return { types: [DevelopmentType.Structure], character: Character.Financier }
  return { types: [DevelopmentType.Structure, DevelopmentType.Vehicle], character: Character.Financier }
}

/**
 * Extract the net positive production from an empire side's Production definition
 * and return resources sorted by amount produced (highest first).
 */
function getEmpireProductionResources(production: Production): Resource[] {
  const amounts: Partial<Record<Resource, number>> = {}

  if (isResource(production)) {
    amounts[production] = 1
  } else if (!isProductionFactor(production)) {
    // Object form: { [Resource]: number }
    const prod = production as { [key in Resource]?: number }
    for (const r of [Resource.Materials, Resource.Energy, Resource.Science, Resource.Gold, Resource.Exploration]) {
      const val = prod[r]
      if (val && val > 0) amounts[r] = val
    }
  }

  return ([Resource.Materials, Resource.Energy, Resource.Science, Resource.Gold, Resource.Exploration] as Resource[])
    .filter(r => (amounts[r] ?? 0) > 0)
    .sort((a, b) => (amounts[b] ?? 0) - (amounts[a] ?? 0))
}

function getStrategy(game: MaterialGame, player: Empire): Strategy {
  const empireSide = (game.memory?.[Memory.EmpireSide] as EmpireSide | undefined) ?? EmpireSide.A
  const empireDetails = Empires[player][empireSide]
  const empireCombo = empireDetails.victoryPoints

  // The empire combo is our primary guide — it's guaranteed from turn 1
  const empirePer = empireCombo ? (Array.isArray(empireCombo.per) ? empireCombo.per : [empireCombo.per]) : []
  const empireStrategy = getComboStrategy(empirePer)
  const empireComboQuantity = empireCombo?.quantity ?? 0

  // Also check if constructed cards have created a stronger combo
  const bestCombo = getBestVictoryPointsCombo(game, player)
  const bestPer = bestCombo ? (Array.isArray(bestCombo.per) ? bestCombo.per : [bestCombo.per]) : []
  const bestStrategy = getComboStrategy(bestPer)

  // Merge: start with empire types, add any extra from bestCombo if it's different
  const valuableTypes = [...empireStrategy.types]
  for (const t of bestStrategy.types) {
    if (!valuableTypes.includes(t)) valuableTypes.push(t)
  }

  // Character: follow empire combo, but if bestCombo's character differs and bestCombo is scoring higher, use that
  const valuableCharacter = empireComboQuantity > 0 ? empireStrategy.character : bestStrategy.character

  // Derive targetResources from the empire's actual production
  // Start with resources the empire produces (sorted by amount), then fill in remaining resources
  const empireProducedResources = getEmpireProductionResources(empireDetails.production)
  const allNonKrystallium = [Resource.Materials, Resource.Energy, Resource.Science, Resource.Gold, Resource.Exploration]
  const targetResources = [
    ...empireProducedResources,
    ...allNonKrystallium.filter(r => !empireProducedResources.includes(r))
  ]

  return { valuableTypes, targetResources, valuableCharacter, bestCombo: empireCombo ?? bestCombo, empireComboQuantity }
}

// ─── Round-budget utilities ──────────────────────────────────────────

/** Total production for each of the 5 resources from empire + constructed cards. */
function getExpectedProduction(game: MaterialGame, player: Empire): Record<Resource, number> {
  return {
    [Resource.Materials]: getProduction(game, player, Resource.Materials),
    [Resource.Energy]: getProduction(game, player, Resource.Energy),
    [Resource.Science]: getProduction(game, player, Resource.Science),
    [Resource.Gold]: getProduction(game, player, Resource.Gold),
    [Resource.Exploration]: getProduction(game, player, Resource.Exploration),
    [Resource.Krystallium]: 0
  } as Record<Resource, number>
}

/** Current available resources (cubes in AvailableResources) + krystallium stock. */
function getAvailableResourceCounts(game: MaterialGame, player: Empire): Record<Resource, number> {
  const counts = {
    [Resource.Materials]: 0, [Resource.Energy]: 0, [Resource.Science]: 0,
    [Resource.Gold]: 0, [Resource.Exploration]: 0, [Resource.Krystallium]: 0
  } as Record<Resource, number>

  const cubes = game.items[MaterialType.ResourceCube] ?? []
  for (const cube of cubes) {
    if (cube?.location?.type === LocationType.AvailableResources && cube?.location?.player === player) {
      const res = cube.id as Resource
      if (res in counts) counts[res] = (counts[res] ?? 0) + 1
    }
    if (cube?.location?.type === LocationType.EmpireCardResources && cube?.location?.player === player) {
      // Krystallium stored on empire card
      counts[Resource.Krystallium] = (counts[Resource.Krystallium] ?? 0) + 1
    }
  }

  return counts
}

/** Remaining cost for a card from actual game state (cubes/tokens already placed). */
function getCardRemainingCostFromGame(
  game: MaterialGame,
  cardIndex: number
): { item: Resource | Character; space: number }[] {
  const card = game.items[MaterialType.DevelopmentCard]?.[cardIndex]
  if (!card) return []
  const development = card.id?.front as Development
  if (!development) return []

  const cost = getCost(development)
  const filledSpaces: (Resource | Character | undefined)[] = Array(cost.length).fill(undefined)

  const cubes = game.items[MaterialType.ResourceCube] ?? []
  for (const cube of cubes) {
    if (cube?.location?.type === LocationType.ConstructionCardCost && cube?.location?.parent === cardIndex) {
      filledSpaces[cube.location?.x ?? 0] = cube.id as Resource
    }
  }
  const tokens = game.items[MaterialType.CharacterToken] ?? []
  for (const token of tokens) {
    if (token?.location?.type === LocationType.ConstructionCardCost && token?.location?.parent === cardIndex) {
      filledSpaces[token.location?.x ?? 0] = token.id as Character
    }
  }

  return getRemainingCost(development, filledSpaces)
}

/** Convert remaining cost array to resource need counts. */
function getRemainingResourceNeeds(remaining: { item: Resource | Character; space: number }[]): Record<Resource, number> {
  const needs = {
    [Resource.Materials]: 0, [Resource.Energy]: 0, [Resource.Science]: 0,
    [Resource.Gold]: 0, [Resource.Exploration]: 0, [Resource.Krystallium]: 0
  } as Record<Resource, number>

  for (const { item } of remaining) {
    if (isResource(item)) {
      needs[item] = (needs[item] ?? 0) + 1
    }
    // Character needs can be filled by krystallium or character tokens — count as krystallium-like
  }
  return needs
}

/** Can a card be completed this round given available + expected production + krystallium as wildcard? */
function canCompleteCardThisRound(
  remaining: { item: Resource | Character; space: number }[],
  available: Record<Resource, number>,
  production: Record<Resource, number>
): boolean {
  // Total budget per resource = available + production
  const budget = { ...available }
  for (const r of [Resource.Materials, Resource.Energy, Resource.Science, Resource.Gold, Resource.Exploration]) {
    budget[r] = (budget[r] ?? 0) + (production[r] ?? 0)
  }

  let unmet = 0
  for (const { item } of remaining) {
    if (isResource(item) && item !== Resource.Krystallium) {
      if ((budget[item] ?? 0) > 0) {
        budget[item]--
      } else {
        unmet++
      }
    } else {
      // Character or krystallium slot
      unmet++
    }
  }

  // Krystallium can fill any unmet need
  const krystalliumAvailable = (available[Resource.Krystallium] ?? 0)
  return unmet <= krystalliumAvailable
}

/** Extract resource types produced by a Production definition. */
function getProducedResources(production: Production | undefined): Resource[] {
  if (!production) return []
  if (isResource(production)) return [production]
  if (isProductionFactor(production)) return [production.resource]
  const prod = production as { [key in Resource]?: number }
  const result: Resource[] = []
  for (const r of [Resource.Materials, Resource.Energy, Resource.Science, Resource.Gold, Resource.Exploration]) {
    if ((prod[r] ?? 0) > 0) result.push(r)
  }
  return result
}

// ─── Card evaluation helpers ─────────────────────────────────────────

function getCardProductionValue(production: Production | undefined, game: MaterialGame, player: Empire, round: number): number {
  if (!production) return 0
  const remainingRounds = 4 - round

  if (isResource(production)) {
    return remainingRounds
  }

  if (isProductionFactor(production)) {
    // Count existing cards of that type
    const cards = game.items[MaterialType.DevelopmentCard] ?? []
    const count = cards.filter(
      (item) => item?.location?.type === LocationType.ConstructedDevelopments && item?.location?.player === player
    ).reduce((sum, item) => {
      const dev = item?.id?.front as Development | undefined
      if (!dev) return sum
      return getDevelopmentDetails(dev).type === production.factor ? sum + 1 : sum
    }, 0)
    return remainingRounds * count
  }

  // Object production
  const prod = production as { [key in Resource]?: number }
  let total = 0
  for (const r of Object.values(Resource).filter((v): v is Resource => typeof v === 'number')) {
    const val = prod[r] ?? 0
    if (val > 0) total += val
  }
  return remainingRounds * total
}

function getCardVPValue(details: ReturnType<typeof getDevelopmentDetails>, scoringDetails: ReturnType<typeof getScoringDetails>): number {
  if (typeof details.victoryPoints === 'number') {
    return details.victoryPoints
  }
  if (details.victoryPoints) {
    return getComboValue(details.victoryPoints, scoringDetails.scoreMultipliers)
  }
  return 0
}

function getTotalCost(development: Development): number {
  const details = getDevelopmentDetails(development)
  let total = 0
  for (const val of Object.values(details.constructionCost)) {
    total += val as number
  }
  return total
}

function getCostFeasibility(development: Development, game: MaterialGame, player: Empire, round: number): number {
  const details = getDevelopmentDetails(development)
  const cost = details.constructionCost
  const remainingRounds = 4 - round
  let matchedProduction = 0
  let totalCost = 0

  for (const [resStr, amount] of Object.entries(cost)) {
    const res = Number(resStr) as Resource | Character
    const qty = amount as number
    totalCost += qty
    if (isResource(res) && res !== Resource.Krystallium) {
      const prod = getProduction(game, player, res)
      matchedProduction += Math.min(qty, prod * (remainingRounds + 1))
    }
  }

  if (totalCost === 0) return 1
  return Math.min(1, matchedProduction / totalCost)
}

function getConstructionBonusValue(details: ReturnType<typeof getDevelopmentDetails>, strategy: Strategy): number {
  if (!details.constructionBonus) return 0
  let value = 0
  // Check if empire combo counts characters as multipliers
  const comboCountsCharacters = strategy.bestCombo
    ? (Array.isArray(strategy.bestCombo.per) ? strategy.bestCombo.per : [strategy.bestCombo.per])
      .some(p => p === Character.Financier || p === Character.General)
    : false

  for (const bonus of details.constructionBonus) {
    if (bonus === Resource.Krystallium) {
      value += 3
    } else if (bonus === strategy.valuableCharacter) {
      // Character that matches our strategy — extra valuable if the empire combo counts it
      value += comboCountsCharacters ? strategy.empireComboQuantity + 1 : 2
    } else {
      value += 1
    }
  }
  return value
}

// ─── Draft phase scoring ─────────────────────────────────────────────

function scoreDraftCard(
  development: Development,
  game: MaterialGame,
  player: Empire,
  strategy: Strategy,
  round: number
): number {
  const details = getDevelopmentDetails(development)
  const scoringDetails = getScoringDetails(game, player)

  // Production value
  const productionValue = getCardProductionValue(details.production, game, player, round)

  // VP value
  const vpValue = getCardVPValue(details, scoringDetails)

  // Construction bonus
  const bonusValue = getConstructionBonusValue(details, strategy)

  // Strategy alignment — scaled by empire combo quantity
  // A card that's a multiplier for a 3VP combo is worth 3× more than for a 1VP combo
  let strategyBonus = 0
  const comboWeight = Math.max(1, strategy.empireComboQuantity)
  if (strategy.valuableTypes.includes(details.type)) {
    strategyBonus += comboWeight
  }
  // Combo alignment: if this card has a combo that matches our strategy
  if (details.victoryPoints && typeof details.victoryPoints !== 'number') {
    const comboPer = Array.isArray(details.victoryPoints.per) ? details.victoryPoints.per : [details.victoryPoints.per]
    if (strategy.bestCombo) {
      const stratPer = Array.isArray(strategy.bestCombo.per) ? strategy.bestCombo.per : [strategy.bestCombo.per]
      if (comboPer.some(p => stratPer.includes(p))) {
        strategyBonus += 2
      }
    }
  }

  // Cost penalty
  const totalCost = getTotalCost(development)
  const feasibility = getCostFeasibility(development, game, player, round)
  const costPenalty = totalCost * (1 - feasibility) * 0.5

  // Recycling bonus value (how useful is the recycled resource)
  const recycleValue = strategy.targetResources.includes(details.recyclingBonus) ? 1 : 0.5

  // Round awareness: early rounds favor production, late rounds favor VP
  const productionWeight = round <= 2 ? 2 : 1
  const vpWeight = round >= 3 ? 2 : 1

  // Synergy with existing constructions
  let synergyBonus = 0
  const constructionCards = (game.items[MaterialType.DevelopmentCard] ?? [])
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      item?.location?.type === LocationType.ConstructionArea && item?.location?.player === player
    )

  if (constructionCards.length > 0) {
    // Recycle synergy: this card's recycling bonus matches a resource needed by an existing construction
    for (const { index } of constructionCards) {
      const remaining = getCardRemainingCostFromGame(game, index)
      const needs = getRemainingResourceNeeds(remaining)
      if ((needs[details.recyclingBonus] ?? 0) > 0) {
        synergyBonus += 2
        break // one match is enough
      }
    }

    // Production synergy: this card's production helps complete existing constructions
    const producedResources = getProducedResources(details.production)
    let prodSynergyCount = 0
    for (const { index } of constructionCards) {
      const remaining = getCardRemainingCostFromGame(game, index)
      const needs = getRemainingResourceNeeds(remaining)
      for (const res of producedResources) {
        if ((needs[res] ?? 0) > 0) {
          prodSynergyCount++
          break // one match per card
        }
      }
    }
    synergyBonus += Math.min(5, prodSynergyCount * 1.5)
  }

  // Late-round penalty: halve score for infeasible cards in rounds 3-4
  const lateRoundPenalty = (round >= 3 && feasibility < 0.3) ? 0.5 : 1

  const rawScore = productionValue * productionWeight + vpValue * vpWeight + bonusValue + strategyBonus + recycleValue + synergyBonus - costPenalty
  return rawScore * lateRoundPenalty
}

// ─── Construction card scoring (multi-factor) ───────────────────────

/**
 * Score a construction card for resource placement priority.
 * Higher score = place resources here first.
 *
 * Factors:
 * - Completion proximity (0-40): non-linear, strongly favors nearly done cards
 * - Feasibility bonus (0-30): can we actually complete it this round?
 * - Investment protection (0-20): proportional to cubes already placed
 * - Card value (0-25): VP + production + strategy alignment (capped)
 * - Production chain bonus (0-10): completing this card produces for later phases
 */
function scoreConstructionCard(
  game: MaterialGame,
  player: Empire,
  cardIndex: number,
  strategy: Strategy,
  round: number,
  currentResource?: Resource // present during production phases
): number {
  const card = game.items[MaterialType.DevelopmentCard]?.[cardIndex]
  if (!card) return 0
  const development = card.id?.front as Development
  if (!development) return 0
  const details = getDevelopmentDetails(development)
  const scoringDetails = getScoringDetails(game, player)

  // Remaining cost from game state
  const remaining = getCardRemainingCostFromGame(game, cardIndex)
  const remainingCount = remaining.length
  const totalCostCount = getCost(development).length
  if (totalCostCount === 0) return 100 // free card, always prioritize

  // 1. Completion proximity (0-40)
  let proximityScore: number
  if (remainingCount === 0) proximityScore = 40
  else if (remainingCount === 1) proximityScore = 35
  else if (remainingCount === 2) proximityScore = 25
  else if (remainingCount <= 4) proximityScore = 15
  else proximityScore = 5

  // 2. Feasibility: can we complete this card this round? (0-30)
  const available = getAvailableResourceCounts(game, player)
  const production = getExpectedProduction(game, player)
  const completable = canCompleteCardThisRound(remaining, available, production)
  const feasibilityScore = completable ? 30 : 0

  // 3. Investment protection (0-20): how much have we already invested?
  const filledCount = totalCostCount - remainingCount
  const investmentScore = totalCostCount > 0 ? (filledCount / totalCostCount) * 20 : 0

  // 4. Card value (0-25): VP + production + strategy, capped
  const productionWeight = round <= 2 ? 2 : 1
  const vpWeight = round >= 3 ? 2 : 1
  const productionValue = getCardProductionValue(details.production, game, player, round) * productionWeight
  const vpValue = getCardVPValue(details, scoringDetails) * vpWeight
  const bonusValue = getConstructionBonusValue(details, strategy)
  const comboWeight = Math.max(1, strategy.empireComboQuantity)
  const strategyBonus = strategy.valuableTypes.includes(details.type) ? comboWeight : 0
  const rawCardValue = productionValue + vpValue + bonusValue + strategyBonus
  const cardValueScore = Math.min(25, rawCardValue)

  // 5. Production chain bonus (0-10): completing this card would produce for later phases
  let chainBonus = 0
  if (currentResource !== undefined && wouldIncreaseUpcomingProduction(development, currentResource)) {
    chainBonus = remainingCount <= 2 ? 10 : 5
  }

  return proximityScore + feasibilityScore + investmentScore + cardValueScore + chainBonus
}

// ─── Planning phase: group-based build/recycle decision ──────────────

type CardPlan = {
  cardIndex: number
  development: Development
  action: 'build' | 'recycle'
  score: number
}

/**
 * Decide which draft cards to build vs recycle, considering the entire group.
 * Returns a plan sorted so highest-priority actions come first.
 */
function buildRoundPlan(
  game: MaterialGame,
  player: Empire,
  strategy: Strategy,
  round: number
): CardPlan[] {
  const draftCards = (game.items[MaterialType.DevelopmentCard] ?? [])
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      item?.location?.type === LocationType.DraftArea && item?.location?.player === player
    )

  if (draftCards.length === 0) return []

  const available = getAvailableResourceCounts(game, player)
  const production = getExpectedProduction(game, player)
  const scoringDetails = getScoringDetails(game, player)

  // Count existing constructions to limit total in-progress cards
  const existingConstructions = (game.items[MaterialType.DevelopmentCard] ?? [])
    .filter(item =>
      item?.location?.type === LocationType.ConstructionArea && item?.location?.player === player
    ).length

  // Score each draft card for build value vs recycle value
  const candidates = draftCards.map(({ item, index }) => {
    const development = item.id?.front as Development
    const details = getDevelopmentDetails(development)
    const totalCost = getTotalCost(development)

    // Build value
    const productionWeight = round <= 2 ? 2 : 1
    const vpWeight = round >= 3 ? 2 : 1
    const prodVal = getCardProductionValue(details.production, game, player, round) * productionWeight
    const vpVal = getCardVPValue(details, scoringDetails) * vpWeight
    const bonusVal = getConstructionBonusValue(details, strategy)
    const comboWeight = Math.max(1, strategy.empireComboQuantity)
    const stratBonus = strategy.valuableTypes.includes(details.type) ? comboWeight : 0
    const feasibility = getCostFeasibility(development, game, player, round)

    // Resource opportunity cost: building this card means not using recycle bonus + spending resources
    const resourceCost = totalCost * (1 - feasibility) * 0.3
    const buildValue = (prodVal + vpVal + bonusVal + stratBonus) * feasibility - resourceCost

    // Can this card be completed this round from scratch?
    const fullCost = getCost(development)
    const remainingFromScratch = fullCost.map((item, space) => ({ item, space }))
    const completableThisRound = canCompleteCardThisRound(remainingFromScratch, available, production)

    // Recycle value
    const recycleIdx = strategy.targetResources.indexOf(details.recyclingBonus)
    const recycleValue = recycleIdx >= 0 ? 3 - recycleIdx * 0.5 : 1

    return {
      cardIndex: index,
      development,
      buildValue: completableThisRound ? buildValue + 5 : buildValue,
      recycleValue,
      feasibility,
      totalCost
    }
  })

  // Sort by net build value (build - recycle opportunity cost)
  candidates.sort((a, b) => (b.buildValue - b.recycleValue) - (a.buildValue - a.recycleValue))

  // Greedy selection: max cards to build depends on round and existing constructions
  const maxBuild = round <= 2 ? Math.max(0, 5 - existingConstructions) : Math.max(0, 3 - existingConstructions)
  let buildCount = 0

  const plan: CardPlan[] = candidates.map(c => {
    const shouldBuild = buildCount < maxBuild && c.buildValue > c.recycleValue && c.feasibility > 0.1
    if (shouldBuild) {
      buildCount++
      return { cardIndex: c.cardIndex, development: c.development, action: 'build' as const, score: c.buildValue }
    }
    return { cardIndex: c.cardIndex, development: c.development, action: 'recycle' as const, score: c.recycleValue }
  })

  // Sort: recycles first (get resources early), then builds by score descending
  plan.sort((a, b) => {
    if (a.action !== b.action) return a.action === 'recycle' ? -1 : 1
    return b.score - a.score
  })

  return plan
}

// ─── Move selection ──────────────────────────────────────────────────

function selectBestMove(scoredMoves: { move: MaterialMove; score: number }[]): MaterialMove {
  if (scoredMoves.length === 0) throw new Error('No moves to select from')
  if (scoredMoves.length === 1) return scoredMoves[0].move

  const maxScore = Math.max(...scoredMoves.map(m => m.score))
  const threshold = maxScore > 0 ? maxScore * 0.85 : maxScore * 1.15
  const topMoves = scoredMoves.filter(m => m.score >= threshold)
  return sample(topMoves)!.move
}

// ─── Production phase helpers ────────────────────────────────────────

const productionOrder: Resource[] = [
  Resource.Materials,
  Resource.Energy,
  Resource.Science,
  Resource.Gold,
  Resource.Exploration
]

const ruleToResource: Partial<Record<RuleId, Resource>> = {
  [RuleId.ProductionMaterials]: Resource.Materials,
  [RuleId.ProductionEnergy]: Resource.Energy,
  [RuleId.ProductionScience]: Resource.Science,
  [RuleId.ProductionGold]: Resource.Gold,
  [RuleId.ProductionExploration]: Resource.Exploration
}

function wouldIncreaseUpcomingProduction(
  development: Development,
  currentResource: Resource
): boolean {
  const details = getDevelopmentDetails(development)
  if (!details.production) return false

  const currentIndex = productionOrder.indexOf(currentResource)

  if (isResource(details.production)) {
    const prodIndex = productionOrder.indexOf(details.production)
    return prodIndex > currentIndex
  }

  if (isProductionFactor(details.production)) {
    const prodIndex = productionOrder.indexOf(details.production.resource)
    return prodIndex > currentIndex
  }

  const prod = details.production as { [key in Resource]?: number }
  for (const [resStr, amount] of Object.entries(prod)) {
    const res = Number(resStr) as Resource
    if ((amount as number) > 0 && productionOrder.indexOf(res) > currentIndex) {
      return true
    }
  }

  return false
}

// ─── Main AI function ────────────────────────────────────────────────

export const ai = (game: MaterialGame, player: Empire): Promise<MaterialMove[]> => {
  const rules = new ItsAWonderfulWorldRules(game)
  const legalMoves = rules.getLegalMoves(player)

  if (legalMoves.length === 0) return Promise.resolve([])
  if (legalMoves.length === 1) return Promise.resolve(legalMoves)

  const rule = game.rule?.id as RuleId | undefined
  const round = (game.memory?.[Memory.Round] as number | undefined) ?? 1
  const strategy = getStrategy(game, player)

  switch (rule) {
    case RuleId.ChooseDevelopmentCard:
      return Promise.resolve([handleDraft(legalMoves, game, player, strategy, round)])

    case RuleId.Planning:
      return Promise.resolve([handlePlanning(legalMoves, game, player, strategy, round)])

    case RuleId.ProductionMaterials:
    case RuleId.ProductionEnergy:
    case RuleId.ProductionScience:
    case RuleId.ProductionGold:
    case RuleId.ProductionExploration:
      return Promise.resolve([handleProduction(legalMoves, game, player, strategy, rule)])

    default:
      return Promise.resolve([sample(legalMoves)!])
  }
}

// ─── Phase handlers ──────────────────────────────────────────────────

function handleDraft(
  legalMoves: MaterialMove[],
  game: MaterialGame,
  player: Empire,
  strategy: Strategy,
  round: number
): MaterialMove {
  // Legal moves are: move a card from PlayerHand to DraftArea
  const cardMoves = legalMoves.filter(
    m => isMoveItemType(MaterialType.DevelopmentCard)(m) && m.location.type === LocationType.DraftArea
  )

  if (cardMoves.length <= 1) return cardMoves[0] ?? legalMoves[0]

  const scoredMoves = cardMoves.map(move => {
    if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return { move, score: 0 }
    const card = game.items[MaterialType.DevelopmentCard]?.[move.itemIndex]
    const development = card?.id?.front as Development | undefined
    if (!development) return { move, score: 0 }

    const score = scoreDraftCard(development, game, player, strategy, round)
    return { move, score }
  })

  return selectBestMove(scoredMoves)
}

function handlePlanning(
  legalMoves: MaterialMove[],
  game: MaterialGame,
  player: Empire,
  strategy: Strategy,
  round: number
): MaterialMove {
  // Check if there are cards in draft area
  const draftCards = (game.items[MaterialType.DevelopmentCard] ?? [])
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      item?.location?.type === LocationType.DraftArea && item?.location?.player === player
    )

  // Use group-based planning to decide build vs recycle for all draft cards
  if (draftCards.length > 0) {
    const plan = buildRoundPlan(game, player, strategy, round)

    // Execute the first planned action that has a legal move
    for (const entry of plan) {
      if (entry.action === 'recycle') {
        const recycleMove = legalMoves.find(
          m => isMoveItemType(MaterialType.DevelopmentCard)(m) &&
            m.itemIndex === entry.cardIndex &&
            m.location.type === LocationType.Discard
        )
        if (recycleMove) return recycleMove
      } else {
        const slateMove = legalMoves.find(
          m => isMoveItemType(MaterialType.DevelopmentCard)(m) &&
            m.itemIndex === entry.cardIndex &&
            m.location.type === LocationType.ConstructionArea
        )
        if (slateMove) return slateMove
      }
    }

    // Fallback: process first draft card (shouldn't normally reach here)
    const { index: cardIndex } = draftCards[0]
    const slateMove = legalMoves.find(
      m => isMoveItemType(MaterialType.DevelopmentCard)(m) &&
        m.itemIndex === cardIndex &&
        m.location.type === LocationType.ConstructionArea
    )
    if (slateMove) return slateMove
    const recycleMove = legalMoves.find(
      m => isMoveItemType(MaterialType.DevelopmentCard)(m) &&
        m.itemIndex === cardIndex &&
        m.location.type === LocationType.Discard
    )
    if (recycleMove) return recycleMove
  }

  // No draft cards left. Place available resources on constructions.
  const resourcePlacementMove = findBestResourcePlacement(legalMoves, game, player, strategy, round)
  if (resourcePlacementMove) return resourcePlacementMove

  // Try direct construction
  const directConstructMove = findDirectConstruction(legalMoves, game, strategy)
  if (directConstructMove) return directConstructMove

  // End turn
  const remainingMoves = legalMoves.filter(m =>
    !isMoveItemType(MaterialType.DevelopmentCard)(m) &&
    !isMoveItemType(MaterialType.ResourceCube)(m) &&
    !isMoveItemType(MaterialType.CharacterToken)(m) &&
    !isCustomMoveType(CustomMoveType.SlateAllForConstruction)(m) &&
    !isCustomMoveType(CustomMoveType.RecycleAll)(m) &&
    !isCreateItem(m)
  )
  if (remainingMoves.length > 0) return remainingMoves[0]

  // Fallback: pick any legal move
  return legalMoves[0]
}

function handleProduction(
  legalMoves: MaterialMove[],
  game: MaterialGame,
  player: Empire,
  strategy: Strategy,
  rule: RuleId
): MaterialMove {
  const currentResource = ruleToResource[rule]!
  const round = (game.memory?.[Memory.Round] as number | undefined) ?? 1

  // Handle science bonus character choice
  const characterCreates = legalMoves.filter(
    m => isCreateItem(m) && m.itemType === MaterialType.CharacterToken
  )
  if (characterCreates.length > 0) {
    // Pick the preferred character
    const preferred = characterCreates.find(
      m => isCreateItem(m) && m.item?.id === strategy.valuableCharacter
    )
    if (preferred) return preferred
    return characterCreates[0]
  }

  // Place resources on constructions (with phase-aware scoring)
  const resourcePlacementMove = findBestResourcePlacement(legalMoves, game, player, strategy, round, currentResource)
  if (resourcePlacementMove) return resourcePlacementMove

  // Direct construction: prefer cards that would increase upcoming production
  const directConstructMoves = legalMoves.filter(
    m => isMoveItemType(MaterialType.DevelopmentCard)(m) &&
      m.location.type === LocationType.ConstructedDevelopments
  )
  if (directConstructMoves.length > 0) {
    const scoredConstructs = directConstructMoves.map(move => {
      if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return { move, score: 0 }
      const card = game.items[MaterialType.DevelopmentCard]?.[move.itemIndex]
      const development = card?.id?.front as Development | undefined
      if (!development) return { move, score: 0 }

      let score = 5
      if (wouldIncreaseUpcomingProduction(development, currentResource)) {
        score += 15 // Big chain bonus
      }
      if (strategy.valuableTypes.includes(getDevelopmentDetails(development).type)) {
        score += 3
      }
      return { move, score }
    })
    return selectBestMove(scoredConstructs)
  }

  // End turn
  const otherMoves = legalMoves.filter(m =>
    !isMoveItemType(MaterialType.DevelopmentCard)(m) &&
    !isMoveItemType(MaterialType.ResourceCube)(m) &&
    !isMoveItemType(MaterialType.CharacterToken)(m) &&
    !isCreateItem(m)
  )
  if (otherMoves.length > 0) return otherMoves[0]

  return legalMoves[0]
}

// ─── Shared resource placement logic ─────────────────────────────────

function findBestResourcePlacement(
  legalMoves: MaterialMove[],
  game: MaterialGame,
  player: Empire,
  strategy: Strategy,
  round: number,
  currentResource?: Resource
): MaterialMove | undefined {
  // Resource placement moves: ResourceCube or CharacterToken → ConstructionCardCost
  const placementMoves = legalMoves.filter(m =>
    (isMoveItemType(MaterialType.ResourceCube)(m) || isMoveItemType(MaterialType.CharacterToken)(m)) &&
    m.location.type === LocationType.ConstructionCardCost
  )

  if (placementMoves.length === 0) return undefined

  // Score each construction card using the multi-factor scoreConstructionCard
  const cardScores = new Map<number, number>()
  for (const move of placementMoves) {
    if (!isMoveItemType(MaterialType.ResourceCube)(move) && !isMoveItemType(MaterialType.CharacterToken)(move)) continue
    const cardIndex = move.location.parent as number
    if (!cardScores.has(cardIndex)) {
      cardScores.set(cardIndex, scoreConstructionCard(game, player, cardIndex, strategy, round, currentResource))
    }
  }

  // Score each placement move
  const scoredMoves = placementMoves.map(move => {
    if (!isMoveItemType(MaterialType.ResourceCube)(move) && !isMoveItemType(MaterialType.CharacterToken)(move)) {
      return { move, score: 0 }
    }
    const cardIndex = move.location.parent as number
    let score = cardScores.get(cardIndex) ?? 0

    // Penalize krystallium usage to save it for cards that truly need it
    const isCube = isMoveItemType(MaterialType.ResourceCube)(move)
    const item = game.items[isCube ? MaterialType.ResourceCube : MaterialType.CharacterToken]?.[move.itemIndex]
    if (item?.id === Resource.Krystallium) {
      score -= 20
    }

    return { move, score }
  })

  // Filter out zero/negative-scored moves
  const constructionPlacements = scoredMoves.filter(m => m.score > 0)
  if (constructionPlacements.length > 0) {
    return selectBestMove(constructionPlacements)
  }

  // If no good construction placements, place on empire card
  const empirePlacements = legalMoves.filter(m =>
    isMoveItemType(MaterialType.ResourceCube)(m) && m.location.type === LocationType.EmpireCardResources
  )
  if (empirePlacements.length > 0) return empirePlacements[0]

  return undefined
}

function findDirectConstruction(
  legalMoves: MaterialMove[],
  game: MaterialGame,
  strategy: Strategy
): MaterialMove | undefined {
  const directConstructMoves = legalMoves.filter(
    m => isMoveItemType(MaterialType.DevelopmentCard)(m) &&
      m.location.type === LocationType.ConstructedDevelopments
  )

  if (directConstructMoves.length === 0) return undefined

  const scoredMoves = directConstructMoves.map(move => {
    if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return { move, score: 0 }
    const card = game.items[MaterialType.DevelopmentCard]?.[move.itemIndex]
    const development = card?.id?.front as Development | undefined
    if (!development) return { move, score: 0 }

    const details = getDevelopmentDetails(development)
    let score = 5
    if (strategy.valuableTypes.includes(details.type)) score += 3
    if (details.production) score += 2
    return { move, score }
  })

  return selectBestMove(scoredMoves)
}
