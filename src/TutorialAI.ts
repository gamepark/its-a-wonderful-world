import produce from 'immer'
import Character, {ChooseCharacter, isCharacter} from './material/characters/Character'
import Construction from './material/developments/Construction'
import Development from './material/developments/Development'
import {developmentCards} from './material/developments/Developments'
import DevelopmentType, {isDevelopmentType} from './material/developments/DevelopmentType'
import EmpireName from './material/empires/EmpireName'
import Resource, {isResource, resources} from './material/resources/Resource'
import {chooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import Move from './moves/Move'
import {placeResource} from './moves/PlaceResource'
import {produce as produceResources} from './moves/Produce'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {recycle} from './moves/Recycle'
import {revealChosenCards} from './moves/RevealChosenCards'
import {slateForConstruction} from './moves/SlateForConstruction'
import {startPhase} from './moves/StartPhase'
import {tellYourAreReady} from './moves/TellYouAreReady'
import ItsAWonderfulWorldRules, {
  canBuild, constructionsThatMayReceiveCubes, getMovesToBuild, getNextProductionStep, getProduction, getRemainingCost, getScore, numberOfRounds,
  placeAvailableCubesMoves
} from './Rules'
import Game from './types/Game'
import Phase from './types/Phase'
import Player from './types/Player'
import PlayerView from './types/PlayerView'

type AIOptions = {
  moves: Move[]
  next: (game: Game) => OptionsEvaluation
  rate: number
}
type OptionsEvaluation = {
  note: number
  moves: Move[]
  improve?: () => OptionsEvaluation
}

export default class TutorialAI {
  private timeLimit: number = 0
  private readonly playerId: EmpireName

  public constructor(playerId: EmpireName) {
    this.playerId = playerId
  }

  play(game: Game): Move[] {
    this.timeLimit = new Date().getTime()
    const player = game.players.find(player => player.empire === this.playerId) as Player
    switch (game.phase) {
      case Phase.Draft:
        this.timeLimit += 5000
        return this.draft(game, player)
      case Phase.Planning:
        this.timeLimit += 10000
        return this.plan(game)
      case Phase.Production:
        this.timeLimit += 5000
        return this.placeResources(game)
    }
  }

  private draft(game: Game, player: Player): Move[] {
    const cardRates = player.hand.reduce<Map<number, number>>((map, card) => {
      const rate = this.rateDevelopment(developmentCards[card], player, game)
      map.set(card, rate)
      return map
    }, new Map<number, number>())
    return this.evaluateOptions(game, player.hand.map(card => ({
      moves: [chooseDevelopmentCard(this.playerId, card)],
      next: (game: Game) => {
        const planningSimulation = produce(game, draft => {
          ItsAWonderfulWorldRules.play(revealChosenCards(), draft, this.playerId)
          ItsAWonderfulWorldRules.play(startPhase(Phase.Planning), draft, this.playerId)
        })
        return ({note: this.planScore(planningSimulation).note, moves: []})
      },
      rate: cardRates[card]
    }))).moves
  }

  private rateDevelopment(development: Development, player: Player, game: Game) {
    return this.buildRate(development, player, game.round) + this.recycleRate(development, player, game.round) + this.counterRate(development, player, game)
  }

  private buildRate(development: Development, player: Player | PlayerView, round: number) {
    return this.expectedProductionRate(development, player, round) + this.expectedScore(development, player)
  }

  private expectedProductionRate(development: Development, player: Player | PlayerView, round: number) {
    if (!development.production) {
      return 0
    } else if (isResource(development.production)) {
      const productionMultiplier = TutorialAI.getProductionMultiplier(development.constructionCost, player, round, development.production)
      return empiresProductionRate[player.empire][development.production] * productionMultiplier
    } else {
      return resources.reduce((sum, resource) => {
        const productionMultiplier = TutorialAI.getProductionMultiplier(development.constructionCost, player, round, resource)
        const production = development.production![resource] as number | DevelopmentType | undefined
        if (isDevelopmentType(production)) {
          sum += (player.constructedDevelopments.filter(card => developmentCards[card].type === production).length + productionMultiplier) * productionMultiplier
        } else if (production) {
          sum += empiresProductionRate[player.empire][resource] * production * productionMultiplier
        }
        return sum
      }, 0)
    }
  }

  private static getProductionMultiplier(constructionCost: { [key in Resource | Character]?: number }, player: Player | PlayerView, round: number, resource: Resource) {
    let missingResources = 0
    for (const resourceCost of resources) {
      const cost = constructionCost[resourceCost]
      if (cost) {
        if (resources.indexOf(resourceCost) >= resources.indexOf(resource)) {
          missingResources += cost
        } else {
          missingResources += Math.max(0, cost - getProduction(player, resource))
        }
      }
    }
    const hopeToBenefitsImmediatelyFromProduction = missingResources === 0 ? 1 : missingResources === 1 ? 0.9 : missingResources === 2 ? 0.7 : missingResources === 3 ? 0.4 : 0
    const roundsLeft = Math.max(0, numberOfRounds - round - (1 - hopeToBenefitsImmediatelyFromProduction))
    return roundsLeft * (roundsLeft + 1) / 2
  }

  private expectedScore(development: Development, player: Player | PlayerView) {
    const expectedScores = empiresExpectedScore[player.empire]
    let expectedScore = expectedScores[development.type]
    if (isCharacter(development.constructionBonus)) {
      expectedScore += expectedScores[development.constructionBonus]
    } else if (development.constructionBonus && !isResource(development.constructionBonus)) {
      if (development.constructionBonus.General) {
        expectedScore += expectedScores.General
      }
      if (development.constructionBonus.Financier) {
        expectedScore += expectedScores.Financier
      }
    }
    if (development.victoryPoints) {
      if (typeof development.victoryPoints === 'number') {
        expectedScore += development.victoryPoints
      } else {
        Object.values(Character).forEach(character => expectedScore += expectedScores[character] * expectedScores[character])
        Object.values(DevelopmentType).forEach(developmentType => expectedScore += expectedScores[developmentType] * expectedScores[developmentType])
      }
    }
    return Math.max(0, expectedScore - (development.constructionCost.Financier || 0) * expectedScores.Financier - (development.constructionCost.General || 0) * expectedScores.General)
  }

  private recycleRate(development: Development, player: Player | PlayerView, round: number) {
    const resource = development.recyclingBonus
    const need = player.constructionArea.reduce((sum, construction) => {
      sum += getRemainingCost(construction).filter(cost => cost.item === resource).length
      return sum
    }, 0)
    const mightNeed = player.draftArea.reduce((sum, card) => {
      sum += developmentCards[card].constructionCost[resource] || 0
      return sum
    }, 0)
    const produce = getProduction(player, resource)
    return 0.2 + Math.max(0, need + mightNeed / 2 - produce * (numberOfRounds + 1 - round))
  }

  private counterRate(development: Development, player: Player, game: Game) {
    return game.players.filter(otherPlayer => otherPlayer.empire !== player.empire).reduce((sum, player) => {
      sum += this.buildRate(development, player, game.round)
      return sum
    }, 0) / game.players.length
  }

  private plan(game: Game): Move[] {
    return this.planScore(game).moves
  }

  private placeResources(game: Game): Move[] {
    return this.placeResourcesScore(game, []).moves
  }

  private evaluateOptions(game: Game, options: AIOptions[]): OptionsEvaluation {
    let bestPlan: OptionsEvaluation = {note: -Infinity, moves: []}
    options.sort((a, b) => b.rate - a.rate)
    for (const option of options) {
      const newState = produce(game, draft => {
        option.moves.forEach(move => ItsAWonderfulWorldRules.play(move, draft, this.playerId))
        applyAutomaticMoves(draft, this.playerId)
      })
      const evaluation = option.next(newState)
      if (bestPlan.note < evaluation.note) {
        bestPlan = {
          note: evaluation.note,
          moves: [...option.moves, ...evaluation.moves]
        }
      }
      if (this.timeLimit < new Date().getTime()) {
        break
      }
    }
    return bestPlan
  }

  private planScore(game: Game): OptionsEvaluation {
    const player = game.players.find(player => player.empire === this.playerId)!
    if (!player.draftArea.length) {
      return this.placeResourcesScore(game, [])
    }
    let confidence = 1, highestConfidenceOptions: AIOptions[] = []
    for (const card of player.draftArea) {
      const buildOption = {moves: [slateForConstruction(this.playerId, card)], next: (game: Game) => this.planScore(game), rate: 0}
      const recycleOption = {moves: [recycle(this.playerId, card)], next: (game: Game) => this.planScore(game), rate: 0}
      const buildRate = this.buildRate(developmentCards[card], player, game.round)
      const recycleRate = this.recycleRate(developmentCards[card], player, game.round)
      if (buildRate === 0) {
        confidence = Infinity
        highestConfidenceOptions = [recycleOption, buildOption]
        break
      } else if (buildRate < recycleRate && recycleRate / buildRate > confidence) {
        confidence = recycleRate / buildRate
        highestConfidenceOptions = [recycleOption, buildOption]
      } else if (recycleRate < buildRate && buildRate / recycleRate > confidence) {
        confidence = buildRate / recycleRate
        highestConfidenceOptions = [buildOption, recycleOption]
      }
    }
    return this.evaluateOptions(game, highestConfidenceOptions)
  }

  private placeResourcesScore(game: Game, doNotBuild: Construction[]): OptionsEvaluation {
    const player = game.players.find(player => player.empire === this.playerId) as Player
    if (player.availableResources.length) {
      const constructions = constructionsThatMayReceiveCubes(player).filter(construction => !doNotBuild.includes(construction))
      return this.evaluateOptions(game, [
        {
          moves: player.availableResources.map(resource => placeResource(this.playerId, resource)),
          next: (game: Game) => this.placeResourcesScore(game, doNotBuild),
          rate: 0
        },
        ...constructions.map(construction => ({
          moves: placeAvailableCubesMoves(player, construction),
          next: (game: Game) => {
            const player = game.players.find(player => player.empire === this.playerId) as Player
            if (player.constructedDevelopments[player.constructedDevelopments.length - 1] === construction.card) {
              return this.placeResourcesScore(game, [])
            } else {
              return this.placeResourcesScore(game, doNotBuild)
            }
          },
          rate: 0
        }))
      ])
    }
    if (player.bonuses.includes(ChooseCharacter)) {
      return this.evaluateOptions(game, [Character.Financier, Character.General].map(character => ({
        moves: [receiveCharacter(this.playerId, character)],
        next: (game: Game) => this.placeResourcesScore(game, doNotBuild),
        rate: 0
      })))
    }
    return this.evaluateOptions(game, [
      ...player.constructionArea.filter(construction => canBuild(player, construction.card))
        .filter(construction => game.productionStep === Resource.Exploration || this.wouldIncreaseNextProduction(game, player, construction.card))
        .map(construction => ({
          moves: getMovesToBuild(player, construction.card),
          next: (game: Game) => this.placeResourcesScore(game, []),
          rate: 0
        })),
      {
        moves: [tellYourAreReady(this.playerId)],
        next: (game: Game) => {
          game = produce(game, draft => {
            if (draft.phase === Phase.Planning) {
              ItsAWonderfulWorldRules.play(startPhase(Phase.Production), draft, this.playerId)
              ItsAWonderfulWorldRules.play(produceResources(Resource.Materials), draft, this.playerId)
            } else {
              const nextProductionStep = getNextProductionStep(draft)
              if (nextProductionStep) {
                ItsAWonderfulWorldRules.play(produceResources(nextProductionStep), draft, this.playerId)
              }
            }
          })
          const roundOver = game.phase === Phase.Production && game.productionStep === Resource.Exploration && game.players.find(player => player.empire === this.playerId)!.availableResources.length === 0
          const bestScore = roundOver ? this.score(game) : this.placeResourcesScore(game, doNotBuild).note
          return {note: bestScore, moves: []}
        },
        rate: 0
      }
    ])
  }

  private wouldIncreaseNextProduction(game: Game, player: Player, card: number) {
    const resource = getNextProductionStep(game) || Resource.Materials
    const newPlayer = produce(player, draft => {
      draft.constructedDevelopments.push(card)
    })
    return getProduction(newPlayer, resource) > getProduction(player, resource)
  }

  private score(game: Game) {
    const player = game.players.find(player => player.empire === this.playerId) as Player
    const roundsLeft = numberOfRounds - game.round
    const potentialScore = roundsLeft > 0 ? this.potentialScore(player, game.round) : 0
    return getScore(player) + roundsLeft * (roundsLeft + 1) / 2 * this.expectedProductionScore(player) + potentialScore
  }

  private potentialScore(player: Player, round: number) {
    const constructionAreaPotential = player.constructionArea.reduce((sum, construction) => {
      const rate = this.buildRate(developmentCards[construction.card], player, round + 1)
      const totalCost = construction.costSpaces.length
      const costPaid = construction.costSpaces.filter(costSpace => !!costSpace).length
      return sum + rate * (totalCost + costPaid) / (totalCost * 2)
    }, 0)
    const resourcesPotential = player.empireCardResources.reduce((sum, resource) => resource === Resource.Krystallium ? sum + 2 : sum + 0.4, 0)
    return constructionAreaPotential + resourcesPotential
  }

  private expectedProductionScore(player: Player) {
    return resources.reduce((sum, resource) => {
      sum += getProduction(player, resource) * empiresProductionRate[this.playerId][resource]
      return sum
    }, 0)
  }
}

const empiresProductionRate: Record<EmpireName, Record<Resource, number>> = {
  [EmpireName.AztecEmpire]: {
    [Resource.Materials]: 0.4,
    [Resource.Energy]: 0.9,
    [Resource.Science]: 0.7,
    [Resource.Gold]: 1.2,
    [Resource.Exploration]: 1.8,
    [Resource.Krystallium]: 2
  },
  [EmpireName.RepublicOfEurope]: {
    [Resource.Materials]: 0.7,
    [Resource.Energy]: 1.1,
    [Resource.Science]: 1,
    [Resource.Gold]: 0.8,
    [Resource.Exploration]: 1.4,
    [Resource.Krystallium]: 2
  },
  [EmpireName.NoramStates]: {
    [Resource.Materials]: 1,
    [Resource.Energy]: 0.8,
    [Resource.Science]: 1,
    [Resource.Gold]: 1.5,
    [Resource.Exploration]: 0.7,
    [Resource.Krystallium]: 2
  },
  [EmpireName.FederationOfAsia]: {
    [Resource.Materials]: 0.8,
    [Resource.Energy]: 0.4,
    [Resource.Science]: 1,
    [Resource.Gold]: 1.8,
    [Resource.Exploration]: 1,
    [Resource.Krystallium]: 2
  },
  [EmpireName.PanafricanUnion]: {
    [Resource.Materials]: 0.6,
    [Resource.Energy]: 0.4,
    [Resource.Science]: 1.8,
    [Resource.Gold]: 1.2,
    [Resource.Exploration]: 1,
    [Resource.Krystallium]: 2
  }
}

const empiresExpectedScore: Record<EmpireName, Record<Character | DevelopmentType, number>> = {
  [EmpireName.AztecEmpire]: {
    [Character.Financier]: 1,
    [Character.General]: 2,
    [DevelopmentType.Discovery]: 5,
    [DevelopmentType.Project]: 0,
    [DevelopmentType.Research]: 0,
    [DevelopmentType.Vehicle]: 0,
    [DevelopmentType.Structure]: 0
  },
  [EmpireName.PanafricanUnion]: {
    [Character.Financier]: 2,
    [Character.General]: 2,
    [DevelopmentType.Discovery]: 0,
    [DevelopmentType.Project]: 0,
    [DevelopmentType.Research]: 6,
    [DevelopmentType.Vehicle]: 0,
    [DevelopmentType.Structure]: 0
  },
  [EmpireName.FederationOfAsia]: {
    [Character.Financier]: 2,
    [Character.General]: 1,
    [DevelopmentType.Discovery]: 0,
    [DevelopmentType.Project]: 6,
    [DevelopmentType.Research]: 1,
    [DevelopmentType.Vehicle]: 0,
    [DevelopmentType.Structure]: 0
  },
  [EmpireName.NoramStates]: {
    [Character.Financier]: 5,
    [Character.General]: 1,
    [DevelopmentType.Discovery]: 0,
    [DevelopmentType.Project]: 2,
    [DevelopmentType.Research]: 0,
    [DevelopmentType.Vehicle]: 0,
    [DevelopmentType.Structure]: 0
  },
  [EmpireName.RepublicOfEurope]: {
    [Character.Financier]: 1,
    [Character.General]: 5,
    [DevelopmentType.Discovery]: 1,
    [DevelopmentType.Project]: 0,
    [DevelopmentType.Research]: 0,
    [DevelopmentType.Vehicle]: 1,
    [DevelopmentType.Structure]: 0
  }
}

function applyAutomaticMoves(game: Game, playerId?: EmpireName): Move[] {
  const moves: Move[] = []
  while (true) {
    const move = ItsAWonderfulWorldRules.getAutomaticMove(game)
    if (move) {
      ItsAWonderfulWorldRules.play(move, game, playerId)
      moves.push(move)
    } else {
      return moves
    }
  }
}