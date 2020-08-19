import {applyAutomaticMoves, GameAI} from '@interlude-games/workshop'
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

const maxThinkingTime = 1000

export default class TutorialAI extends GameAI<Game, Move, EmpireName> {
  private playTime: number = 0

  public constructor(playerId: EmpireName) {
    super(playerId)
  }

  play(game: Game): Move[] {
    this.playTime = new Date().getTime()
    const player = game.players.find(player => player.empire === this.playerId) as Player
    switch (game.phase) {
      case Phase.Draft:
        return [this.draft(game, player)]
      case Phase.Planning:
        return this.plan(game)
      case Phase.Production:
        return this.placeResources(game)
    }
  }

  private draft(game: Game, player: Player): Move {
    const cardRates = player.hand.reduce<Map<number, number>>((map, card) => {
      const rate = this.rateDevelopment(developmentCards[card], player, game)
      map.set(card, rate * rate)
      return map
    }, new Map<number, number>())
    const rateSum = [...cardRates.values()].reduce((sum, rate) => sum + rate)
    let random = Math.random() * rateSum
    for (const cardRate of cardRates) {
      if (random < cardRate[1]) {
        return chooseDevelopmentCard(player.empire, cardRate[0])
      }
      random -= cardRate[1]
    }
    throw new Error('Implementation error: there should always be a random card chosen by the draft method')
  }

  private rateDevelopment(development: Development, player: Player, game: Game) {
    return this.buildRate(development, player, game.round) + this.discardRate(development, player, game.round) + this.counterRate(development, player, game)
  }

  private buildRate(development: Development, player: Player | PlayerView, round: number) {
    return this.expectedProductionRate(development, player, round) + this.expectedScore(development, player)
  }

  private expectedProductionRate(development: Development, player: Player | PlayerView, round: number) {
    const roundsLeft = numberOfRounds - round
    const productionMultiplier = roundsLeft * (roundsLeft + 1) / 2
    if (!development.production) {
      return 0
    } else if (isResource(development.production)) {
      return empiresProductionRate[player.empire][development.production] * productionMultiplier
    } else {
      return resources.reduce((sum, resource) => {
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

  private discardRate(development: Development, player: Player | PlayerView, round: number) {
    const resource = development.recyclingBonus
    const need = player.constructionArea.reduce((sum, construction) => {
      sum += getRemainingCost(construction).filter(cost => cost.item === resource).length
      return sum
    }, 0)
    const produce = getProduction(player, resource)
    return 1 + Math.max(0, need - produce * (numberOfRounds + 1 - round))
  }

  private counterRate(development: Development, player: Player, game: Game) {
    return game.players.filter(otherPlayer => otherPlayer.empire !== player.empire).reduce((sum, player) => {
      sum += this.buildRate(development, player, game.round) + this.discardRate(development, player, game.round)
      return sum
    }, 0) / game.players.length
  }

  private plan(game: Game): Move[] {
    return this.planScore(game)[1]
  }

  private placeResources(game: Game): Move[] {
    return this.placeResourcesScore(game, [])[1]
  }

  private evaluateOptions(game: Game, options: { moves: Move[], next: (game: Game) => [number, Move[]] }[]): [number, Move[]] {
    let bestPlan: [number, Move[]] = [-Infinity, []]
    for (const option of options) {
      const newState = produce(game, draft => {
        option.moves.forEach(move => ItsAWonderfulWorldRules.play(move, draft, this.playerId))
        applyAutomaticMoves(ItsAWonderfulWorldRules, draft, this.playerId)
      })
      const evaluation = option.next(newState)
      if (bestPlan[0] < evaluation[0]) {
        bestPlan = [evaluation[0], [...option.moves, ...evaluation[1]]]
      }
      if (this.playTime + maxThinkingTime < new Date().getTime()) {
        break
      }
    }
    return bestPlan
  }

  private planScore(game: Game): [number, Move[]] {
    const player = game.players.find(player => player.empire === this.playerId)!
    if (!player.draftArea.length) {
      return this.placeResourcesScore(game, [])
    }
    // TODO: not always slate for construction before recycle, evaluate build vs discard benefits first
    return this.evaluateOptions(game, [
      {moves: [slateForConstruction(this.playerId, player.draftArea[0])], next: (game: Game) => this.planScore(game)},
      {moves: [recycle(this.playerId, player.draftArea[0])], next: (game: Game) => this.planScore(game)}
    ])
  }

  private placeResourcesScore(game: Game, doNotBuild: Construction[]): [number, Move[]] {
    const player = game.players.find(player => player.empire === this.playerId) as Player
    if (player.availableResources.length) {
      const constructions = constructionsThatMayReceiveCubes(player).filter(construction => !doNotBuild.includes(construction))
      return this.evaluateOptions(game, [
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
          mergeMoves: true
        })),
        {
          moves: player.availableResources.map(resource => placeResource(this.playerId, resource)),
          next: (game: Game) => this.placeResourcesScore(game, doNotBuild),
          mergeMoves: true
        }
      ])
    }
    if (player.bonuses.includes(ChooseCharacter)) {
      return this.evaluateOptions(game, [Character.Financier, Character.General].map(character => ({
        moves: [receiveCharacter(this.playerId, character)],
        next: (game: Game) => this.placeResourcesScore(game, doNotBuild),
        mergeMoves: true
      })))
    }
    return this.evaluateOptions(game, [
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
          const bestScore = roundOver ? this.score(game) : this.placeResourcesScore(game, doNotBuild)[0]
          return [bestScore, []]
        }
      },
      ...player.constructionArea.filter(construction => canBuild(player, construction.card))
        .filter(construction => game.productionStep === Resource.Exploration || this.wouldIncreaseNextProduction(game, player, construction.card))
        .map(construction => ({
          moves: getMovesToBuild(player, construction.card),
          next: (game: Game) => this.placeResourcesScore(game, [])
        }))
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
      const costLeft = construction.costSpaces.filter(costSpace => !!costSpace).length
      return sum + rate * (costLeft + 1) / (totalCost + 1)
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