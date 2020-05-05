import {
  Action, GameWithIncompleteInformation, shuffle, SimultaneousGame, WithAnimations, WithAutomaticMoves, WithOptions, WithUndo
} from '@interlude-games/workshop'
import ItsAWonderfulWorld, {
  DevelopmentUnderConstruction, EmpireSide, isGameView, isPlayerView, ItsAWonderfulWorldView, Options, Phase, Player, PlayerView
} from './ItsAWonderfulWorld'
import Character, {ChooseCharacter, isCharacter} from './material/characters/Character'
import Development, {isConstructionBonus} from './material/developments/Development'
import {developmentCards} from './material/developments/Developments'
import DevelopmentType, {isDevelopmentType} from './material/developments/DevelopmentType'
import EmpireName from './material/empires/EmpireName'
import Empires from './material/empires/Empires'
import Resource, {isResource} from './material/resources/Resource'
import {chooseDevelopmentCard, isChooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import {completeConstruction} from './moves/CompleteConstruction'
import {dealDevelopmentCards, isDealDevelopmentCardsView} from './moves/DealDevelopmentCards'
import {discardLeftoverCards, isDiscardLeftoverCardsView} from './moves/DiscardLeftoverCards'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {isPassCardsView, passCards} from './moves/PassCards'
import {placeCharacter} from './moves/PlaceCharacter'
import {isPlaceResourceOnConstruction, placeResource} from './moves/PlaceResource'
import {produce} from './moves/Produce'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {recycle} from './moves/Recycle'
import {isRevealChosenCardsView, revealChosenCards} from './moves/RevealChosenCards'
import {slateForConstruction} from './moves/SlateForConstruction'
import {startPhase} from './moves/StartPhase'
import {tellYourAreReady} from './moves/TellYouAreReady'
import {transformIntoKrystallium} from './moves/TransformIntoKrystallium'

export const numberOfCardsToDraft = 7
const numberOfCardsDeal2Players = 10
export const numberOfRounds = 4
const playersMin = 2
const playersMax = 5
const defaultNumberOfPlayers = 5
const defaultEmpireCardsSide = EmpireSide.A

type GameType = SimultaneousGame<ItsAWonderfulWorld, Move, EmpireName>
  & GameWithIncompleteInformation<ItsAWonderfulWorld, Move, EmpireName, ItsAWonderfulWorldView, MoveView>
  & WithOptions<ItsAWonderfulWorld, Options>
  & WithAutomaticMoves<ItsAWonderfulWorld, Move>
  & WithUndo<ItsAWonderfulWorld, Move, EmpireName>
  & WithAnimations<ItsAWonderfulWorldView, MoveView, EmpireName>

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: GameType = {
  setup(options?: Options) {
    return {
      players: setupPlayers(options?.players, options?.empiresSide),
      deck: shuffle(Array.from(developmentCards.keys())),
      discard: [],
      round: 1,
      phase: Phase.Draft
    }
  },

  getPlayerIds(game: ItsAWonderfulWorld) {
    return game.players.map(player => player.empire)
  },

  getActivePlayers(game: ItsAWonderfulWorld) {
    switch (game.phase) {
      case Phase.Draft:
        return game.players.filter(player => !player.chosenCard).map(player => player.empire)
      case Phase.Planning:
      case Phase.Production:
        return game.players.filter(player => !player.ready).map(player => player.empire)
    }
  },

  getAutomaticMove(game: ItsAWonderfulWorld | ItsAWonderfulWorldView) {
    switch (game.phase) {
      case Phase.Draft:
        if (isGameView(game)) {
          return // There is hidden information during Draft phase, so consequences of actions cannot be predicted on client side
        }
        const anyPlayer = game.players![0]
        if (!anyPlayer.hand.length && !anyPlayer.draftArea.length) {
          return dealDevelopmentCards()
        } else if (game.players.every(player => player.chosenCard !== undefined)) {
          return revealChosenCards()
        } else if (anyPlayer.cardsToPass) {
          return passCards()
        } else if (anyPlayer.draftArea.length === numberOfCardsToDraft) {
          if (anyPlayer.hand.length) {
            return discardLeftoverCards()
          } else {
            return startPhase(Phase.Planning)
          }
        } else {
          for (const player of game.players) {
            if (player.chosenCard === undefined && player.hand.length === 1) {
              return chooseDevelopmentCard(player.empire, player.hand[0])
            }
          }
        }
        break
      case Phase.Planning:
        if (game.players.every(player => player.ready)) {
          return startPhase(Phase.Production)
        }
        break
      case Phase.Production:
        if (!game.productionStep) {
          return produce(Resource.Materials)
        } else if (game.players.every(player => player.ready)) {
          const nextProductionStep = getNextProductionStep(game)
          if (nextProductionStep) {
            return produce(nextProductionStep)
          } else if (game.round < numberOfRounds) {
            return startPhase(Phase.Draft)
          }
        }
        break
    }
    for (const player of game.players) {
      for (const developmentUnderConstruction of player.constructionArea) {
        if (developmentUnderConstruction.costSpaces.every(space => space !== null)) {
          return completeConstruction(player.empire, developmentUnderConstruction.card)
        }
      }
      if (player.empireCardResources.filter(resource => resource !== Resource.Krystallium).length >= 5) {
        return transformIntoKrystallium(player.empire)
      }
      const bonus = player.bonuses.find(bonus => bonus !== ChooseCharacter)
      if (isResource(bonus)) {
        return placeResource(player.empire, bonus)
      } else if (isCharacter(bonus)) {
        return receiveCharacter(player.empire, bonus)
      }
    }
    return
  },

  getLegalMoves(game: ItsAWonderfulWorld, empire: EmpireName) {
    const player = game.players.find(player => player.empire === empire)
    return player ? getLegalMoves(player, game.phase) : []
  },

  play(move: Move | MoveView, game: ItsAWonderfulWorld | ItsAWonderfulWorldView, playerId: EmpireName) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards: {
        const cardsToDeal = game.players.length === 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft
        game.players.forEach(player => {
          if (playerId && player.empire === playerId && isDealDevelopmentCardsView(move)) {
            player.hand = move.playerCards
          } else if (isGameView(game)) {
            player.hand = cardsToDeal
          } else {
            player.hand = game.deck.splice(0, cardsToDeal)
          }
        })
        if (playerId && isDealDevelopmentCardsView(move)) {
          getPlayer(game, playerId).hand = move.playerCards
        }
        break
      }
      case MoveType.ChooseDevelopmentCard: {
        const player = getPlayer(game, move.playerId)
        if (isPlayerView(player)) {
          player.hand--
          player.chosenCard = true
        } else if (isChooseDevelopmentCard(move)) {
          player.hand = player.hand.filter(card => card !== move.card)
          player.chosenCard = move.card
        }
        break
      }
      case MoveType.RevealChosenCards: {
        if (isRevealChosenCardsView(move)) {
          game.players.forEach(player => {
            player.draftArea.push(move.revealedCards[player.empire]!)
            player.chosenCard = isPlayerView(player) ? false : undefined
          })
        } else if (!isGameView(game)) {
          game.players.forEach(player => {
            player.draftArea.push(player.chosenCard!)
            delete player.chosenCard
            if (player.draftArea.length < numberOfCardsToDraft) {
              player.cardsToPass = player.hand
            }
          })
        }
        break
      }
      case MoveType.PassCards: {
        if (playerId && isPassCardsView(move)) {
          const player = getPlayer(game, playerId)
          player.hand = move.receivedCards
        } else if (!isGameView(game)) {
          const draftDirection = game.round % 2 ? -1 : 1
          for (let i = 0; i < game.players.length; i++) {
            let previousPlayer = game.players![(i + game.players.length + draftDirection) % game.players.length]
            game.players![i].hand = previousPlayer.cardsToPass!
          }
          game.players.forEach(player => delete player.cardsToPass)
        }
        break
      }
      case MoveType.DiscardLeftoverCards: {
        if (!isGameView(game)) {
          game.players.forEach(player => game.discard.push(...player.hand.splice(0)))
        } else {
          game.players.forEach(player => player.hand = [])
          if (isDiscardLeftoverCardsView(move)) {
            game.discard.push(...move.discardedCards)
          }
        }
        break
      }
      case MoveType.StartPhase: {
        game.phase = move.phase
        game.players.forEach(player => player.ready = false)
        if (move.phase === Phase.Draft) {
          delete game.productionStep
          game.round++
        }
        break
      }
      case MoveType.SlateForConstruction: {
        const player = getPlayer(game, move.playerId)
        player.draftArea = player.draftArea.filter(card => card !== move.card)
        player.constructionArea.push({card: move.card, costSpaces: Array(costSpaces(developmentCards[move.card])).fill(null)})
        break
      }
      case MoveType.Recycle: {
        const player = getPlayer(game, move.playerId)
        const indexInDraftArea = player.draftArea.findIndex(card => card === move.card)
        if (indexInDraftArea !== -1) {
          player.draftArea.splice(indexInDraftArea, 1)
          player.availableResources.push(developmentCards[move.card].recyclingBonus)
        } else {
          player.constructionArea = player.constructionArea.filter(developmentUnderConstruction => developmentUnderConstruction.card !== move.card)
          player.bonuses.push(developmentCards[move.card].recyclingBonus)
        }
        game.discard.push(move.card)
        break
      }
      case MoveType.PlaceResource: {
        const player = getPlayer(game, move.playerId)
        const bonusIndex = player.bonuses.findIndex(bonus => bonus === move.resource)
        if (bonusIndex !== -1) {
          player.bonuses.splice(bonusIndex, 1)
        } else if (move.resource !== Resource.Krystallium) {
          player.availableResources.splice(player.availableResources.indexOf(move.resource), 1)
        } else {
          player.empireCardResources.splice(player.empireCardResources.indexOf(move.resource), 1)
        }
        if (isPlaceResourceOnConstruction(move)) {
          player.constructionArea.find(construction => construction.card === move.card)!.costSpaces[move.space] = move.resource
        } else {
          player.empireCardResources.push(move.resource)
        }
        break
      }
      case MoveType.CompleteConstruction: {
        const player = getPlayer(game, move.playerId)
        player.constructionArea = player.constructionArea.filter(developmentUnderConstruction => developmentUnderConstruction.card !== move.card)
        player.constructedDevelopments.push(move.card)
        const bonus = developmentCards[move.card].constructionBonus
        if (bonus) {
          if (isConstructionBonus(bonus)) {
            player.bonuses.push(bonus)
          } else {
            Object.keys(bonus).filter(isConstructionBonus).forEach(bonusType => player.bonuses.push(...new Array(bonus[bonusType]).fill(bonusType)))
          }
        }
        break
      }
      case MoveType.TransformIntoKrystallium: {
        const player = getPlayer(game, move.playerId)
        for (let i = 0; i < 5; i++) {
          player.empireCardResources.splice(player.empireCardResources.findIndex(resource => resource !== Resource.Krystallium), 1)
        }
        player.empireCardResources.push(Resource.Krystallium)
        break
      }
      case MoveType.TellYouAreReady: {
        getPlayer(game, move.playerId).ready = true
        break
      }
      case MoveType.Produce: {
        game.productionStep = move.resource
        let highestProduction = 0
        let singleMostPlayer: Player | PlayerView | undefined
        game.players.forEach(player => {
          player.availableResources = new Array(getProduction(player, move.resource)).fill(move.resource)
          player.ready = false
          if (player.availableResources.length > highestProduction) {
            singleMostPlayer = player
            highestProduction = player.availableResources.length
          } else if (player.availableResources.length === highestProduction) {
            singleMostPlayer = undefined
          }
        })
        if (singleMostPlayer) {
          switch (move.resource) {
            case Resource.Materials:
            case Resource.Gold:
              singleMostPlayer.bonuses.push(Character.Financier)
              break
            case Resource.Energy:
            case Resource.Exploration:
              singleMostPlayer.bonuses.push(Character.General)
              break
            default:
              singleMostPlayer.bonuses.push(ChooseCharacter)
              break
          }
        }
        break
      }
      case MoveType.ReceiveCharacter: {
        const player = getPlayer(game, move.playerId)
        player.characters[move.character]++
        let bonusIndex = player.bonuses.indexOf(move.character)
        if (bonusIndex === -1) {
          bonusIndex = player.bonuses.indexOf(ChooseCharacter)
        }
        player.bonuses.splice(bonusIndex, 1)
        break
      }
      case MoveType.PlaceCharacter: {
        const player = getPlayer(game, move.playerId)
        player.characters[move.character]--
        player.constructionArea.find(construction => construction.card === move.card)!.costSpaces[move.space] = move.character
        break
      }
    }
  },

  canUndo(action: Action<Move, EmpireName>, consecutiveActions: Action<Move, EmpireName>[], game: ItsAWonderfulWorld | ItsAWonderfulWorldView) {
    const {playerId, move} = action
    const player = game.players.find(player => player.empire === playerId)!
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return player.chosenCard === move.card
      case MoveType.SlateForConstruction:
      case MoveType.Recycle:
      case MoveType.PlaceCharacter:
      case MoveType.PlaceResource:
      case MoveType.ReceiveCharacter:
        return !consecutiveActions.some(action => action.playerId === playerId)
      case MoveType.TellYouAreReady:
        return !action.consequences.some(consequence => consequence.type === MoveType.StartPhase || consequence.type === MoveType.Produce)
          && !consecutiveActions.some(action => action.consequences.some(consequence => consequence.type === MoveType.StartPhase || consequence.type === MoveType.Produce))
      default:
        return false
    }
  },

  getView(game: ItsAWonderfulWorld, playerId?: EmpireName): ItsAWonderfulWorldView {
    return {
      ...game, deck: game.deck.length,
      players: game.players.map(player => player.empire !== playerId ?
        {...player, hand: player.hand.length, chosenCard: player.chosenCard !== undefined} : player
      )
    }
  },

  getMoveView(move: Move, playerId: EmpireName, game: ItsAWonderfulWorld): MoveView {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        return playerId ? {...move, playerCards: game.players.find(player => player.empire === playerId)!.hand} : move
      case MoveType.ChooseDevelopmentCard:
        if (playerId !== move.playerId) {
          delete move.card
        }
        return move
      case MoveType.RevealChosenCards:
        return {
          ...move, revealedCards: game.players.reduce<{ [key in EmpireName]?: number }>((revealedCards, player) => {
            revealedCards[player.empire] = player.draftArea[player.draftArea.length - 1]
            return revealedCards
          }, {})
        }
      case MoveType.PassCards:
        return {...move, receivedCards: playerId ? game.players.find(player => player.empire === playerId)!.hand : undefined}
      case MoveType.DiscardLeftoverCards:
        return {...move, discardedCards: game.discard.slice()}
    }
    return move
  },

  getAnimationDuration(move: MoveView) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return 0.5
      /*case MoveType.DiscardLeftoverCards:
        return [0.5]*/
      default:
        return 0
    }
  },

  getUndoAnimationDuration(move: MoveView) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return 0.3
      /*case MoveType.DiscardLeftoverCards:
        return [0.5]*/
      default:
        return 0
    }
  }
}

function setupPlayers(players?: number | [{ empire?: EmpireName }], empireSide?: EmpireSide) {
  if (Array.isArray(players) && players.length >= playersMin && players.length <= playersMax) {
    const empiresLeft = shuffle(Object.values(EmpireName).filter(empire => players.some(player => player.empire === empire)))
    return players.map<Player>(player => setupPlayer(player.empire || empiresLeft.pop()!, empireSide))
  } else if (typeof players === 'number' && Number.isInteger(players) && players >= playersMin && players <= playersMax) {
    return shuffle(Object.values(EmpireName)).slice(0, players).map<Player>(empire => setupPlayer(empire, empireSide))
  } else {
    return shuffle(Object.values(EmpireName)).slice(0, defaultNumberOfPlayers).map<Player>(empire => setupPlayer(empire, empireSide))
  }
}

function setupPlayer(empire: EmpireName, empireSide?: EmpireSide): Player {
  return {
    empire, empireSide: empireSide || defaultEmpireCardsSide, hand: [], draftArea: [], constructionArea: [], availableResources: [], empireCardResources: [],
    constructedDevelopments: [], ready: false, characters: {[Character.Financier]: 0, [Character.General]: 0}, bonuses: []
  }
}

function getPlayer(game: ItsAWonderfulWorld | ItsAWonderfulWorldView, empire: EmpireName): Player | PlayerView {
  return game.players.find(player => player.empire === empire)!
}

export function getLegalMoves(player: Player, phase: Phase) {
  const moves: Move[] = []
  switch (phase) {
    case Phase.Draft:
      if (player.chosenCard === undefined) {
        player.hand.forEach(card => moves.push(chooseDevelopmentCard(player.empire, card)))
      }
      break
    case Phase.Planning:
      player.draftArea.forEach(card => moves.push(slateForConstruction(player.empire, card), recycle(player.empire, card)))
      if (!player.draftArea.length && !player.availableResources.length && !player.ready) {
        moves.push(tellYourAreReady(player.empire))
      }
      break
    case Phase.Production:
      if (!player.bonuses.length && !player.availableResources.length && !player.ready) {
        moves.push(tellYourAreReady(player.empire))
      }
      break
  }
  player.availableResources.forEach(resource => {
    player.constructionArea.forEach(developmentUnderConstruction => {
      getSpacesMissingItem(developmentUnderConstruction, item => item === resource)
        .forEach(space => moves.push(placeResource(player.empire, resource, developmentUnderConstruction.card, space)))
    })
    moves.push(placeResource(player.empire, resource))
  })
  if (player.bonuses.some(bonus => bonus === ChooseCharacter)) {
    Object.values(Character).forEach(character => moves.push(receiveCharacter(player.empire, character)))
  }
  if (moves.length) {
    player.constructionArea.forEach(developmentUnderConstruction => {
      moves.push(recycle(player.empire, developmentUnderConstruction.card))
    })
    if (player.empireCardResources.some(resource => resource === Resource.Krystallium)) {
      player.constructionArea.forEach(developmentUnderConstruction => {
        getSpacesMissingItem(developmentUnderConstruction, item => isResource(item))
          .forEach(space => moves.push(placeResource(player.empire, Resource.Krystallium, developmentUnderConstruction.card, space)))
      })
    }
    Object.values(Character).forEach(character => {
      if (player.characters[character]) {
        player.constructionArea.forEach(developmentUnderConstruction => {
          getSpacesMissingItem(developmentUnderConstruction, item => item === character)
            .forEach(space => moves.push(placeCharacter(player.empire, character, developmentUnderConstruction.card, space)))
        })
      }
    })
  }
  return moves
}

function costSpaces(development: Development) {
  return Object.values(development.constructionCost).reduce((sum, cost) => sum! + cost!)
}

export function getRemainingCost(developmentUnderConstruction: DevelopmentUnderConstruction): { item: Resource | Character, space: number }[] {
  const development = developmentCards[developmentUnderConstruction.card]
  return Array.of<Resource | Character>(...Object.values(Resource), ...Object.values(Character))
    .flatMap(item => Array(development.constructionCost[item] || 0).fill(item))
    .map((item, index) => ({item, space: index}))
    .filter(item => !developmentUnderConstruction.costSpaces[item.space])
}

function getSpacesMissingItem(developmentUnderConstruction: DevelopmentUnderConstruction, predicate: (item: Resource | Character) => boolean) {
  return getRemainingCost(developmentUnderConstruction).filter(cost => predicate(cost.item)).map(cost => cost.space)
}

export function getNextProductionStep(game: ItsAWonderfulWorld | ItsAWonderfulWorldView) {
  switch (game.productionStep) {
    case Resource.Materials:
      return Resource.Energy
    case Resource.Energy:
      return Resource.Science
    case Resource.Science:
      return Resource.Gold
    case Resource.Gold:
      return Resource.Exploration
    default:
      return undefined
  }
}

export function getProduction(player: Player | PlayerView, resource: Resource): number {
  return getBaseProduction(player, resource) + player.constructedDevelopments.reduce((sum, card) => sum + getDevelopmentProduction(player, developmentCards[card], resource), 0)
}

function getBaseProduction(player: Player | PlayerView, resource: Resource): number {
  return Empires[player.empire][player.empireSide].production[resource] || 0
}

function getDevelopmentProduction(player: Player | PlayerView, development: Development, resource: Resource): number {
  if (!development.production) {
    return 0
  } else if (isResource(development.production)) {
    return development.production === resource ? 1 : 0
  } else {
    const production = development.production[resource]
    if (isDevelopmentType(production)) {
      return player.constructedDevelopments.filter(card => developmentCards[card].type === production).length
    } else {
      return production || 0
    }
  }
}

function getCardVictoryPointsMultiplier(item: DevelopmentType | Character, victoryPoints?: number | { [key in DevelopmentType | Character]?: number }): number {
  return victoryPoints && typeof victoryPoints !== 'number' && victoryPoints[item] ? victoryPoints[item]! : 0
}

export function getVictoryPointsBonusMultiplier(player: Player | PlayerView, item: DevelopmentType | Character): number {
  return getCardVictoryPointsMultiplier(item, Empires[player.empire][player.empireSide].victoryPoints) +
    player.constructedDevelopments.map(card => developmentCards[card].victoryPoints)
      .reduce<number>((sum, victoryPoints) => sum + getCardVictoryPointsMultiplier(item, victoryPoints), 0)
}

export function getVictoryPointsMultiplier(player: Player | PlayerView, item: DevelopmentType | Character): number {
  return isDevelopmentType(item) ? getVictoryPointsBonusMultiplier(player, item) : getVictoryPointsBonusMultiplier(player, item) + 1
}

export function getScore(player: Player | PlayerView): number {
  return getFlatVictoryPoints(player)
    + Object.values(DevelopmentType).reduce((sum, developmentType) => sum + getComboVictoryPoints(player, developmentType), 0)
    + Object.values(Character).reduce((sum, characterType) => sum + getComboVictoryPoints(player, characterType), 0)

}

export function getFlatVictoryPoints(player: Player | PlayerView): number {
  return player.constructedDevelopments.map(card => developmentCards[card].victoryPoints)
    .reduce<number>((sum, victoryPoints) => sum + (typeof victoryPoints == 'number' ? victoryPoints : 0), 0)
}

export function getComboVictoryPoints(player: Player | PlayerView, item: DevelopmentType | Character): number {
  return getItemQuantity(player, item) * getVictoryPointsMultiplier(player, item)
}

export function getItemQuantity(player: Player | PlayerView, item: DevelopmentType | Character): number {
  return isDevelopmentType(item) ? player.constructedDevelopments.filter(card => developmentCards[card].type === item).length : player.characters[item]
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules