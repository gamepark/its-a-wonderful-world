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
import {isPlaceResource, placeResource} from './moves/PlaceResource'
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

export default class TutorialAI extends GameAI<Game, Move, EmpireName> {
  private planTime: number = 0

  public constructor(playerId: EmpireName) {
    super(playerId)
  }

  play(game: Game): Move[] {
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
    return this.buildRate(development, player, game) + this.discardRate(development, player, game) + this.counterRate(development, player, game)
  }

  private buildRate(development: Development, player: Player | PlayerView, game: Game) {
    return this.expectedProductionRate(development, player, game) + this.expectedScore(development, player)
  }

  private expectedProductionRate(development: Development, player: Player | PlayerView, game: Game) {
    const roundsLeft = numberOfRounds - game.round
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
          sum += empiresProductionRate[player.empire][production] * productionMultiplier
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

  private discardRate(development: Development, player: Player | PlayerView, game: Game) {
    const resource = development.recyclingBonus
    const need = player.constructionArea.reduce((sum, construction) => {
      sum += getRemainingCost(construction).filter(cost => cost.item === resource).length
      return sum
    }, 0)
    const produce = getProduction(player, resource)
    return 1 + Math.max(0, need - produce * (numberOfRounds + 1 - game.round))
  }

  private counterRate(development: Development, player: Player, game: Game) {
    return game.players.filter(otherPlayer => otherPlayer.empire !== player.empire).reduce((sum, player) => {
      sum += this.buildRate(development, player, game) + this.discardRate(development, player, game)
      return sum
    }, 0) / game.players.length
  }

  private plan(game: Game): Move[] {
    this.planTime = new Date().getTime()
    return this.planScore(game)[1]
  }

  private placeResources(game: Game): Move[] {
    return this.placeResourcesScore(game, [])[1]
  }

  private planScore(game: Game): [number, Move[]] {
    const player = game.players.find(player => player.empire === this.playerId)!
    if (!player.draftArea.length) {
      return this.placeResourcesScore(game, [])
    }
    let buildPlan: [number, Move[]], recyclePlan: [number, Move[]]
    const build = slateForConstruction(this.playerId, player.draftArea[0])
    const buildResult = produce(game, draft => {
      ItsAWonderfulWorldRules.play(build, draft, this.playerId)
    })
    buildPlan = this.planScore(buildResult)
    buildPlan[1] = [build, ...buildPlan[1]]
    if (this.planTime + 5000 < new Date().getTime()) {
      return buildPlan // limit plan to a few seconds.
    }
    const recycleMove = recycle(this.playerId, player.draftArea[0])
    const recycleResult = produce(game, draft => {
      ItsAWonderfulWorldRules.play(recycleMove, draft, this.playerId)
    })
    recyclePlan = this.planScore(recycleResult)
    recyclePlan[1] = [recycleMove, ...recyclePlan[1]]
    return buildPlan[0] >= recyclePlan[0] ? buildPlan : recyclePlan
  }

  private placeResourcesScore(game: Game, doNotBuild: Construction[]): [number, Move[]] {
    const player = game.players.find(player => player.empire === this.playerId) as Player
    if (player.availableResources.filter(resource => resource !== Resource.Krystallium).length) {
      const constructions = constructionsThatMayReceiveCubes(player).filter(construction => !doNotBuild.includes(construction))
      let bestPlan = this.placeResourcesOnEmpireCard(game, player, [...doNotBuild, ...constructions])
      for (const construction of constructions) {
        const plan = this.placeResourcesOnConstruction(game, player, construction, doNotBuild)
        if (plan[0] >= bestPlan[0]) {
          bestPlan = plan
        }
        doNotBuild = [...doNotBuild, construction]
      }
      return bestPlan
    }
    if (player.bonuses.includes(ChooseCharacter)) {
      const financierPlan = this.chooseCharacter(game, Character.Financier, doNotBuild)
      const generalPlan = this.chooseCharacter(game, Character.General, doNotBuild)
      return financierPlan[0] >= generalPlan[0] ? financierPlan : generalPlan
    }
    let bestPlan = this.pass(game, doNotBuild)
    for (const construction of player.constructionArea) {
      if (canBuild(player, construction.card) && (game.productionStep === Resource.Exploration || this.wouldIncreaseNextProduction(game, player, construction.card))) {
        const moves = getMovesToBuild(player, construction.card)
        const buildPlan = this.buildPlan(game, moves)
        if (!moves.some(move => isPlaceResource(move) && move.resource === Resource.Krystallium) || buildPlan[0] > bestPlan[0]) {
          bestPlan = buildPlan
        }
      }
    }
    return bestPlan
  }

  private wouldIncreaseNextProduction(game: Game, player: Player, card: number) {
    const resource = getNextProductionStep(game) || Resource.Materials
    const newPlayer = produce(player, draft => {
      draft.constructedDevelopments.push(card)
    })
    return getProduction(newPlayer, resource) > getProduction(player, resource)
  }

  private placeResourcesOnEmpireCard(game: Game, player: Player, doNotBuild: Construction[]): [number, Move[]] {
    const moves: Move[] = []
    const newState = produce(game, draft => {
      player.availableResources.forEach(resource => {
        const move = placeResource(player.empire, resource)
        moves.push(move)
        ItsAWonderfulWorldRules.play(move, draft, player.empire)
        applyAutomaticMoves(ItsAWonderfulWorldRules, draft, this.playerId)
      })
    })
    const bestScore = this.placeResourcesScore(newState, doNotBuild)
    bestScore[1] = [...moves, ...bestScore[1]]
    return bestScore
  }

  private placeResourcesOnConstruction(game: Game, player: Player, construction: Construction, doNotBuild: Construction[]) {
    const moves = placeAvailableCubesMoves(player, construction)
    const newState = produce(game, draft => {
      moves.forEach(move => ItsAWonderfulWorldRules.play(move, draft, player.empire))
      applyAutomaticMoves(ItsAWonderfulWorldRules, draft, this.playerId)
    })
    // if we finish a building, we may now consider again all the constructions we ignored before
    const newPlayer = newState.players.find(player => player.empire === this.playerId) as Player
    if (newPlayer.constructedDevelopments[newPlayer.constructedDevelopments.length - 1] === construction.card) {
      doNotBuild = []
    }
    const bestScore = this.placeResourcesScore(newState, doNotBuild)
    bestScore[1] = [...moves, ...bestScore[1]]
    return bestScore
  }

  private chooseCharacter(game: Game, character: Character, doNotBuild: Construction[]): [number, Move[]] {
    const move = receiveCharacter(this.playerId, character)
    const newState = produce(game, draft => {
      ItsAWonderfulWorldRules.play(move, draft, this.playerId)
    })
    const bestScore = this.placeResourcesScore(newState, doNotBuild)
    bestScore[1] = [move, ...bestScore[1]]
    return bestScore
  }

  private pass(game: Game, doNotBuild: Construction[]): [number, Move[]] {
    const move = tellYourAreReady(this.playerId)
    const newState = produce(game, draft => {
      ItsAWonderfulWorldRules.play(move, draft, this.playerId)
      if (draft.phase === Phase.Planning) {
        ItsAWonderfulWorldRules.play(startPhase(Phase.Production), draft, this.playerId)
        ItsAWonderfulWorldRules.play(produceResources(Resource.Materials), draft, this.playerId)
      } else {
        const nextProductionStep = getNextProductionStep(game)
        if (nextProductionStep) {
          ItsAWonderfulWorldRules.play(produceResources(nextProductionStep), draft, this.playerId)
        }
      }
    })
    const roundOver = game.phase === Phase.Production && game.productionStep === Resource.Exploration && newState.players.find(player => player.empire === this.playerId)!.availableResources.filter(resource => resource !== Resource.Krystallium).length === 0
    const bestScore = roundOver ? this.score(newState) : this.placeResourcesScore(newState, doNotBuild)[0]
    return [bestScore, [move]]
  }

  private buildPlan(game: Game, moves: Move[]): [number, Move[]] {
    const newState = produce(game, draft => {
      moves.forEach(move => ItsAWonderfulWorldRules.play(move, draft, this.playerId))
      applyAutomaticMoves(ItsAWonderfulWorldRules, draft, this.playerId)
    })
    const bestScore = this.placeResourcesScore(newState, [])
    return [bestScore[0], [...moves, ...bestScore[1]]]
  }

  private score(newState: Game) {
    const player = newState.players.find(player => player.empire === this.playerId) as Player
    const roundsLeft = numberOfRounds - newState.round
    const startedConstructionBonus = roundsLeft > 0 ? TutorialAI.startedConstructionBonus(player) : 0
    return getScore(player) + roundsLeft * (roundsLeft + 1) / 2 * this.expectedProductionScore(player) + startedConstructionBonus
  }

  private expectedProductionScore(player: Player) {
    return resources.reduce((sum, resource) => {
      sum += getProduction(player, resource) * empiresProductionRate[this.playerId][resource]
      return sum
    }, 0)
  }

  private static startedConstructionBonus(player: Player) {
    return player.constructionArea.reduce((sum, construction) => {
      sum += construction.costSpaces.filter(costSpace => !!costSpace).length + 1
      return sum
    }, 0)
  }
}

const empiresProductionRate: Record<EmpireName, Record<Resource, number>> = {
  [EmpireName.AztecEmpire]: {
    [Resource.Materials]: 0.1,
    [Resource.Energy]: 1,
    [Resource.Science]: 0.5,
    [Resource.Gold]: 1.5,
    [Resource.Exploration]: 3,
    [Resource.Krystallium]: 3
  },
  [EmpireName.RepublicOfEurope]: {
    [Resource.Materials]: 0.3,
    [Resource.Energy]: 1.5,
    [Resource.Science]: 1,
    [Resource.Gold]: 0.8,
    [Resource.Exploration]: 2,
    [Resource.Krystallium]: 3
  },
  [EmpireName.NoramStates]: {
    [Resource.Materials]: 0.8,
    [Resource.Energy]: 0.8,
    [Resource.Science]: 1,
    [Resource.Gold]: 2,
    [Resource.Exploration]: 0.5,
    [Resource.Krystallium]: 3
  },
  [EmpireName.FederationOfAsia]: {
    [Resource.Materials]: 0.5,
    [Resource.Energy]: 0.1,
    [Resource.Science]: 1,
    [Resource.Gold]: 3,
    [Resource.Exploration]: 1,
    [Resource.Krystallium]: 3
  },
  [EmpireName.PanafricanUnion]: {
    [Resource.Materials]: 0.5,
    [Resource.Energy]: 0.3,
    [Resource.Science]: 3,
    [Resource.Gold]: 1.5,
    [Resource.Exploration]: 1,
    [Resource.Krystallium]: 3
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