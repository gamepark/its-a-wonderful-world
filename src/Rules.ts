import {
  Action, GameWithIncompleteInformation, shuffle, SimultaneousGame, WithAnimations, WithAutomaticMoves, WithOptions, WithUndo
} from '@interlude-games/workshop'
import Character, {ChooseCharacter, isCharacter} from './material/characters/Character'
import Construction from './material/developments/Construction'
import Development, {isConstructionBonus} from './material/developments/Development'
import {developmentCards} from './material/developments/Developments'
import DevelopmentType, {isDevelopmentType} from './material/developments/DevelopmentType'
import EmpireName from './material/empires/EmpireName'
import Empires from './material/empires/Empires'
import EmpireSide from './material/empires/EmpireSide'
import Resource, {isResource} from './material/resources/Resource'
import {chooseDevelopmentCard, isChosenDevelopmentCardVisible} from './moves/ChooseDevelopmentCard'
import {completeConstruction} from './moves/CompleteConstruction'
import {dealDevelopmentCards, isDealDevelopmentCardsView} from './moves/DealDevelopmentCards'
import {discardLeftoverCards, isDiscardLeftoverCardsView} from './moves/DiscardLeftoverCards'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {isPassCardsView, passCards} from './moves/PassCards'
import PlaceCharacter, {placeCharacter} from './moves/PlaceCharacter'
import {isPlaceResourceOnConstruction, placeResource, PlaceResourceOnConstruction} from './moves/PlaceResource'
import {produce} from './moves/Produce'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {recycle} from './moves/Recycle'
import {isRevealChosenCardsView, revealChosenCards} from './moves/RevealChosenCards'
import {slateForConstruction} from './moves/SlateForConstruction'
import {startPhase} from './moves/StartPhase'
import {tellYourAreReady} from './moves/TellYouAreReady'
import {transformIntoKrystallium} from './moves/TransformIntoKrystallium'
import Game from './types/Game'
import GameOptions from './types/GameOptions'
import GameView from './types/GameView'
import Phase from './types/Phase'
import Player from './types/Player'
import PlayerView from './types/PlayerView'
import {isGameView, isPlayerView} from './types/typeguards'

export const numberOfCardsToDraft = 7
const numberOfCardsDeal2Players = 10
export const numberOfRounds = 4
const playersMin = 2
const playersMax = 5
const defaultNumberOfPlayers = 2
const defaultEmpireCardsSide = EmpireSide.A

type GameType = SimultaneousGame<Game, Move, EmpireName>
  & GameWithIncompleteInformation<Game, Move, EmpireName, GameView, MoveView>
  & WithOptions<Game, GameOptions>
  & WithAutomaticMoves<Game, Move>
  & WithUndo<Game, Move, EmpireName>
  & WithAnimations<GameView, MoveView, EmpireName>

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: GameType = {
  setup(options?: GameOptions) {
    return {
      players: setupPlayers(options?.players, options?.empiresSide),
      deck: shuffle(Array.from(developmentCards.keys())),
      discard: [],
      round: 1,
      phase: Phase.Draft
    }
  },

  getPlayerIds(game: Game) {
    return game.players.map(player => player.empire)
  },

  getActivePlayers(game: Game) {
    switch (game.phase) {
      case Phase.Draft:
        return game.players.filter(player => !player.chosenCard).map(player => player.empire)
      case Phase.Planning:
      case Phase.Production:
        return game.players.filter(player => !player.ready).map(player => player.empire)
    }
  },

  getAutomaticMove(game: Game | GameView) {
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
      for (const construction of player.constructionArea) {
        if (construction.costSpaces.every(space => space !== null)) {
          return completeConstruction(player.empire, construction.card)
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
      for (const resource of [...new Set(player.availableResources)]) {
        if (!player.draftArea.some(card => developmentCards[card].constructionCost[resource])
          && !player.constructionArea.some(construction => getSpacesMissingItem(construction, item => item === resource).length > 0)) {
          // Automatically place resources on the Empire card if there is 0 chance to place it on a development
          return placeResource(player.empire, resource)
        }
      }
    }
    return
  },

  getLegalMoves(game: Game, empire: EmpireName) {
    const player = game.players.find(player => player.empire === empire)
    if (!player || (game.round === numberOfRounds && game.productionStep === Resource.Exploration && player.ready)) {
      return []
    }
    return getLegalMoves(player, game.phase)
  },

  play(move: Move | MoveView, game: Game | GameView, playerId: EmpireName) {
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
        } else if (isChosenDevelopmentCardVisible(move)) {
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
          player.constructionArea = player.constructionArea.filter(construction => construction.card !== move.card)
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
          const construction = player.constructionArea.find(construction => construction.card === move.card)
          if (construction) {
            construction.costSpaces[move.space] = move.resource
          } else {
            console.error('Could not find the construction to place a resource on!')
          }
        } else {
          player.empireCardResources.push(move.resource)
        }
        break
      }
      case MoveType.CompleteConstruction: {
        const player = getPlayer(game, move.playerId)
        player.constructionArea = player.constructionArea.filter(construction => construction.card !== move.card)
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

  canUndo(action: Action<Move, EmpireName>, consecutiveActions: Action<Move, EmpireName>[], game: Game | GameView) {
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

  getView(game: Game, playerId?: EmpireName): GameView {
    return {
      ...game, deck: game.deck.length,
      players: game.players.map(player => player.empire !== playerId ?
        {...player, hand: player.hand.length, chosenCard: player.chosenCard !== undefined} : player
      )
    }
  },

  getMoveView(move: Move, playerId: EmpireName, game: Game): MoveView {
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

  getAnimationDuration(move: MoveView, _: GameView, playerId: EmpireName) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return 0.5
      case MoveType.SlateForConstruction:
      case MoveType.Recycle:
      case MoveType.CompleteConstruction:
        return 0.3
      case MoveType.PlaceResource:
        return move.playerId === playerId && isPlaceResourceOnConstruction(move) ? 0 : 0.2
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

function getPlayer(game: Game | GameView, empire: EmpireName): Player | PlayerView {
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
  [...new Set(player.availableResources)].forEach(resource => {
    player.constructionArea.forEach(construction => {
      getSpacesMissingItem(construction, item => item === resource)
        .forEach(space => moves.push(placeResource(player.empire, resource, construction.card, space)))
    })
    moves.push(placeResource(player.empire, resource))
  })
  if (player.bonuses.some(bonus => bonus === ChooseCharacter)) {
    Object.values(Character).forEach(character => moves.push(receiveCharacter(player.empire, character)))
  }
  player.constructionArea.forEach(construction => {
    moves.push(recycle(player.empire, construction.card))
  })
  if (player.empireCardResources.some(resource => resource === Resource.Krystallium)) {
    player.constructionArea.forEach(construction => {
      getSpacesMissingItem(construction, item => isResource(item))
        .forEach(space => moves.push(placeResource(player.empire, Resource.Krystallium, construction.card, space)))
    })
  }
  Object.values(Character).forEach(character => {
    if (player.characters[character]) {
      player.constructionArea.forEach(construction => {
        getSpacesMissingItem(construction, item => item === character)
          .forEach(space => moves.push(placeCharacter(player.empire, character, construction.card, space)))
      })
    }
  })
  return moves
}

function costSpaces(development: Development) {
  return Object.values(development.constructionCost).reduce((sum, cost) => sum! + cost!)
}

export function getRemainingCost(construction: Construction): { item: Resource | Character, space: number }[] {
  const development = developmentCards[construction.card]
  return Array.of<Resource | Character>(...Object.values(Resource), ...Object.values(Character))
    .flatMap(item => Array(development.constructionCost[item] || 0).fill(item))
    .map((item, index) => ({item, space: index}))
    .filter(item => !construction.costSpaces[item.space])
}

function getSpacesMissingItem(construction: Construction, predicate: (item: Resource | Character) => boolean) {
  return getRemainingCost(construction).filter(cost => predicate(cost.item)).map(cost => cost.space)
}

export function getNextProductionStep(game: Game | GameView) {
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

export function canBuild(player: Player, card: number): boolean {
  const construction = player.constructionArea.find(construction => construction.card === card)
  if (!construction) {
    return false
  }
  const remainingCost = getRemainingCost(construction)
  for (const character of Object.values(Character)) {
    if (player.characters[character] < remainingCost.filter(cost => cost.item === character).length) {
      return false
    }
  }
  let krystalliumLeft = player.empireCardResources.filter(resource => resource === Resource.Krystallium).length
  for (const resource of Object.values(Resource)) {
    const resourceCost = remainingCost.filter(cost => cost.item === resource).length
    const resources = player.availableResources.filter(r => r === resource).length
    if (resources < resourceCost) {
      if (krystalliumLeft + resources < resourceCost) {
        return false
      }
      krystalliumLeft -= resourceCost - resources
    }
  }
  return true
}

export function getMovesToBuild(player: Player, card: number): (PlaceResourceOnConstruction | PlaceCharacter)[] {
  const moves: (PlaceResourceOnConstruction | PlaceCharacter)[] = []
  const construction = player.constructionArea.find(construction => construction.card === card)!
  const remainingCost = getRemainingCost(construction)
  for (const resource of Object.values(Resource)) {
    const resourceCosts = remainingCost.filter(cost => cost.item === resource)
    let resources = player.availableResources.filter(r => r === resource).length
    for (const cost of resourceCosts) {
      if (resources > 0) {
        moves.push(placeResource(player.empire, resource, card, cost.space))
        resources--
      } else {
        moves.push(placeResource(player.empire, Resource.Krystallium, card, cost.space))
      }
    }
  }
  for (const cost of remainingCost) {
    if (isCharacter(cost.item)) {
      moves.push(placeCharacter(player.empire, cost.item, card, cost.space))
    }
  }
  return moves
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules