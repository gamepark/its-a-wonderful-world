import { Action, Competitive, Eliminations, Rules, SecretInformation, TimeLimit, Undo } from '@gamepark/rules-api'
import { shuffle } from 'lodash'
import canUndo from './canUndo'
import GameState from './GameState'
import GameView from './GameView'
import Character, { characters, ChooseCharacter, isCharacter } from './material/Character'
import Construction from './material/Construction'
import { totalCost } from './material/DevelopmentDetails'
import { ascensionDevelopmentCardIds, baseDevelopmentCardIds, getCardDetails, getCardType } from './material/Developments'
import EmpireName from './material/EmpireName'
import Empires from './material/Empires'
import EmpireSide from './material/EmpireSide'
import Resource, { isResource, resources } from './material/Resource'
import { chooseDevelopmentCard, chooseDevelopmentCardMove } from './moves/ChooseDevelopmentCard'
import { completeConstruction, completeConstructionMove } from './moves/CompleteConstruction'
import { concede, concedeMove } from './moves/Concede'
import { dealDevelopmentCards, dealDevelopmentCardsMove, getDealDevelopmentCardsView } from './moves/DealDevelopmentCards'
import { discardLeftOverCards, discardLeftOverCardsMove, getDiscardLeftoverCardsView } from './moves/DiscardLeftoverCards'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import { getPassCardsView, passCards, passCardsMove } from './moves/PassCards'
import PlaceCharacter, { isPlaceCharacter, placeCharacter, placeCharacterMove } from './moves/PlaceCharacter'
import PlaceResource, {
  isPlaceResourceOnConstruction,
  placeResource,
  PlaceResourceOnConstruction,
  placeResourceOnConstructionMove,
  placeResourceOnEmpireMove
} from './moves/PlaceResource'
import { produce, produceMove } from './moves/Produce'
import { receiveCharacter, receiveCharacterMove } from './moves/ReceiveCharacter'
import { recycle, recycleMove } from './moves/Recycle'
import { getRevealChosenCardsView, revealChosenCards, revealChosenCardsMove } from './moves/RevealChosenCards'
import { slateForConstruction, slateForConstructionMove } from './moves/SlateForConstruction'
import { startPhase, startPhaseMove } from './moves/StartPhase'
import { tellYouAreReady, tellYouAreReadyMove } from './moves/TellYouAreReady'
import { transformIntoKrystallium, transformIntoKrystalliumMove } from './moves/TransformIntoKrystallium'
import { isGameOptions, ItsAWonderfulWorldOptions } from './Options'
import Phase from './Phase'
import Player from './Player'
import PlayerView from './PlayerView'
import { getPlayerScore } from './Scoring'
import { isPlayerView } from './typeguards'

export const numberOfCardsToDraft = 7
export const numberOfRounds = 4

const defaultEmpireCardsSide = EmpireSide.A

// noinspection JSUnusedGlobalSymbols
export default class ItsAWonderfulWorld extends Rules<GameState, Move, EmpireName>
  implements SecretInformation<GameView, Move, MoveView, EmpireName>,
    Undo<GameState, Move, EmpireName>,
    Competitive<GameState, Move, EmpireName>,
    Eliminations<Move, EmpireName>,
    TimeLimit<GameState, Move, EmpireName> {

  constructor(state: GameState)
  constructor(options: ItsAWonderfulWorldOptions)
  constructor(arg: ItsAWonderfulWorldOptions | GameState) {
    if (isGameOptions(arg)) {
      const setup: GameState = {
        players: setupPlayers(arg),
        deck: shuffle(baseDevelopmentCardIds),
        discard: [],
        round: 1,
        phase: Phase.Draft
      }
      if (arg.corruptionAndAscension) {
        setup.ascensionDeck = shuffle(ascensionDevelopmentCardIds)
      }
      super(setup)
    } else {
      super(arg)
    }
  }

  isTurnToPlay(playerId: EmpireName): boolean {
    return isTurnToPlay(this.state, playerId)
  }

  isOver(): boolean {
    return isOver(this.state)
  }

  getAutomaticMoves(): Move[] {
    const move = this.getAutomaticMove()
    return move ? [move] : []
  }

  getAutomaticMove(): Move | undefined {
    switch (this.state.phase) {
      case Phase.Draft:
        const anyPlayer = this.state.players.filter(player => !player.eliminated)[0]
        if (anyPlayer && !anyPlayer.hand.length && !anyPlayer.draftArea.length) {
          return dealDevelopmentCardsMove
        } else if (this.state.players.every(player => player.chosenCard !== undefined || (player.eliminated && !player.hand.length))) {
          return revealChosenCardsMove
        } else if (anyPlayer && anyPlayer.cardsToPass) {
          return passCardsMove
        } else if (anyPlayer && anyPlayer.draftArea.length === numberOfCardsToDraft) {
          if (anyPlayer.hand.length) {
            return discardLeftOverCardsMove
          } else {
            return startPhaseMove(Phase.Planning)
          }
        } else {
          for (const player of this.state.players) {
            if (player.chosenCard === undefined && player.hand.length === 1) {
              return chooseDevelopmentCardMove(player.empire, player.hand[0])
            }
          }
        }
        break
      case Phase.Planning:
        if (this.state.players.every(player => player.ready)) {
          return startPhaseMove(Phase.Production)
        }
        break
      case Phase.Production:
        if (!this.state.productionStep) {
          return produceMove(Resource.Materials)
        } else if (this.state.players.every(player => player.ready)) {
          const nextProductionStep = getNextProductionStep(this.state)
          if (nextProductionStep) {
            return produceMove(nextProductionStep)
          } else if (this.state.round < numberOfRounds) {
            return startPhaseMove(Phase.Draft)
          }
        }
        break
    }
    return getPredictableAutomaticMoves(this.state)
  }

  getLegalMoves(empire: EmpireName) {
    const player = this.state.players.find(player => player.empire === empire)
    if (!player || (this.state.round === numberOfRounds && this.state.productionStep === Resource.Exploration && player.ready)) {
      return []
    }
    return getLegalMoves(player, this.state.phase)
  }

  play(move: Move): Move[] {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        dealDevelopmentCards(this.state)
        break
      case MoveType.ChooseDevelopmentCard:
        chooseDevelopmentCard(this.state, move)
        break
      case MoveType.RevealChosenCards:
        revealChosenCards(this.state)
        break
      case MoveType.PassCards:
        passCards(this.state)
        break
      case MoveType.DiscardLeftoverCards:
        discardLeftOverCards(this.state)
        break
      case MoveType.StartPhase:
        startPhase(this.state, move)
        break
      case MoveType.SlateForConstruction:
        slateForConstruction(this.state, move)
        break
      case MoveType.Recycle:
        recycle(this.state, move)
        break
      case MoveType.PlaceResource:
        placeResource(this.state, move)
        break
      case MoveType.CompleteConstruction:
        completeConstruction(this.state, move)
        break
      case MoveType.TransformIntoKrystallium:
        transformIntoKrystallium(this.state, move)
        break
      case MoveType.TellYouAreReady:
        tellYouAreReady(this.state, move)
        break
      case MoveType.Produce:
        produce(this.state, move)
        break
      case MoveType.ReceiveCharacter:
        receiveCharacter(this.state, move)
        break
      case MoveType.PlaceCharacter:
        placeCharacter(this.state, move)
        break
      case MoveType.Concede:
        concede(this.state, move)
        break
    }
    return []
  }

  getScore(empire: EmpireName): number {
    return getPlayerScore(this.getPlayer(empire))
  }

  getPlayer(playerId: EmpireName): Player {
    const player = this.state.players.find(player => player.empire === playerId)
    if (!player) throw new Error(`${playerId} is expected on ${this.state}`)
    return player
  }

  rankPlayers(empireA: EmpireName, empireB: EmpireName): number {
    const playerA = this.getPlayer(empireA), playerB = this.getPlayer(empireB)
    if (playerA.eliminated || playerB.eliminated) {
      return playerA.eliminated ? playerB.eliminated ? playerB.eliminated - playerA.eliminated : 1 : -1
    }
    const scoreA = getPlayerScore(playerA), scoreB = getPlayerScore(playerB)
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }
    const buildingsA = playerA.constructedDevelopments.length, buildingsB = playerB.constructedDevelopments.length
    if (buildingsA !== buildingsB) {
      return buildingsB - buildingsA
    }
    return countCharacters(playerB) - countCharacters(playerA)
  }

  canUndo(action: Action<Move, EmpireName>, consecutiveActions: Action<Move, EmpireName>[]) {
    return canUndo(this.state, action, consecutiveActions)
  }

  getView(playerId?: EmpireName | undefined): GameView {
    return {
      ...this.state, deck: this.state.deck.length, ascensionDeck: this.state.ascensionDeck?.length,
      players: this.state.players.map(player => {
        if (player.empire === playerId) {
          return player
        } else {
          const {hand, chosenCard, ...visible} = player
          const playerView: PlayerView = {...visible, hiddenHand: hand.map(getCardType)}
          if (chosenCard !== undefined) {
            playerView.ready = true
          }
          return playerView
        }
      })
    }
  }

  getPlayerView(playerId: EmpireName): GameView {
    return this.getView(playerId)
  }

  getMoveView(move: Move, playerId?: EmpireName): MoveView {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        return playerId ? getDealDevelopmentCardsView(this.state, playerId) : move
      case MoveType.ChooseDevelopmentCard:
        if (playerId !== move.playerId) {
          const {card, ...moveView} = move
          return {...moveView}
        }
        break
      case MoveType.RevealChosenCards:
        return getRevealChosenCardsView(this.state)
      case MoveType.PassCards:
        return playerId ? getPassCardsView(this.state, playerId) : move
      case MoveType.DiscardLeftoverCards:
        return getDiscardLeftoverCardsView(this.state)
    }
    return move
  }

  getPlayerMoveView(move: Move, playerId: EmpireName): MoveView {
    return this.getMoveView(move, playerId)
  }

  isEliminated(playerId: EmpireName): boolean {
    return !!this.getPlayer(playerId).eliminated
  }

  giveUpMove(playerId: EmpireName): Move {
    return concedeMove(playerId)
  }

  giveTime(playerId: EmpireName): number {
    switch (this.state.phase) {
      case Phase.Draft:
        return (numberOfCardsToDraft - this.getPlayer(playerId).draftArea.length - 1) * 10
      case Phase.Planning:
        return 20 + this.state.round * 40
      case Phase.Production:
        return 10
    }
  }
}

export function setupPlayers(options: ItsAWonderfulWorldOptions) {
  const players = options.players
  const empireSide = options.empiresSide
  const empiresLeft = shuffle(Object.values(EmpireName).filter(empire => players.some(player => player.id === empire)))
  return players.map<Player>(player => setupPlayer(player.id || empiresLeft.pop()!, empireSide))
}

function setupPlayer(empire: EmpireName, empireSide: EmpireSide = defaultEmpireCardsSide): Player {
  return {
    empire, empireSide, hand: [], draftArea: [], constructionArea: [], availableResources: [],
    empireCardResources: Array(Empires[empire][empireSide].krystallium ?? 0).fill(Resource.Krystallium),
    constructedDevelopments: [], ready: false, characters: {[Character.Financier]: 0, [Character.General]: 0}, bonuses: []
  }
}

export function getPredictableAutomaticMoves(state: GameState | GameView): Move & MoveView | undefined {
  for (const player of state.players) {
    for (const construction of player.constructionArea) {
      if (construction.costSpaces.every(space => space !== null)) {
        return completeConstructionMove(player.empire, construction.card)
      }
    }
    if (player.empireCardResources.filter(resource => resource !== Resource.Krystallium).length >= 5) {
      return transformIntoKrystalliumMove(player.empire)
    }
    const bonus = player.bonuses.find(bonus => bonus !== ChooseCharacter)
    if (isResource(bonus)) {
      return placeResourceOnEmpireMove(player.empire, bonus)
    } else if (isCharacter(bonus)) {
      return receiveCharacterMove(player.empire, bonus)
    }
    for (const resource of [...new Set(player.availableResources)]) {
      if (!player.draftArea.some(card => getCardDetails(card).constructionCost[resource])
        && !player.constructionArea.some(construction => couldPlaceResource(construction, resource))) {
        // Automatically place resources on the Empire card if there is 0 chance to place it on a development
        return placeResourceOnEmpireMove(player.empire, resource)
      }
    }
  }
  return
}

export function getLegalMoves(player: Player, phase: Phase) {
  const moves: Move[] = []
  switch (phase) {
    case Phase.Draft:
      if (player.chosenCard === undefined) {
        player.hand.forEach(card => moves.push(chooseDevelopmentCardMove(player.empire, card)))
      }
      break
    case Phase.Planning:
      player.draftArea.forEach(card => moves.push(slateForConstructionMove(player.empire, card), recycleMove(player.empire, card)))
      if (!player.draftArea.length && !player.availableResources.length && !player.ready) {
        moves.push(tellYouAreReadyMove(player.empire))
      }
      break
    case Phase.Production:
      if (!player.bonuses.length && !player.availableResources.length && !player.ready) {
        moves.push(tellYouAreReadyMove(player.empire))
      }
      break
  }
  [...new Set(player.availableResources)].forEach(resource => {
    player.constructionArea.forEach(construction => {
      getSpacesMissingItem(construction, item => item === resource)
        .forEach(space => moves.push(placeResourceOnConstructionMove(player.empire, resource, construction.card, space)))
    })
    moves.push(placeResourceOnEmpireMove(player.empire, resource))
  })
  if (player.bonuses.some(bonus => bonus === ChooseCharacter)) {
    characters.forEach(character => moves.push(receiveCharacterMove(player.empire, character)))
  }
  player.constructionArea.forEach(construction => {
    moves.push(recycleMove(player.empire, construction.card))
  })
  if (player.empireCardResources.some(resource => resource === Resource.Krystallium)) {
    player.constructionArea.forEach(construction => {
      getSpacesMissingItem(construction, item => isResource(item))
        .forEach(space => moves.push(placeResourceOnConstructionMove(player.empire, Resource.Krystallium, construction.card, space)))
    })
  }
  characters.forEach(character => {
    if (player.characters[character]) {
      player.constructionArea.forEach(construction => {
        getSpacesMissingItem(construction, item => item === character)
          .forEach(space => moves.push(placeCharacterMove(player.empire, character, construction.card, space)))
      })
    }
  })
  return moves
}

export function getCost(card: number): (Resource | Character)[] {
  const development = getCardDetails(card)
  return Array.of<Resource | Character>(...resources, ...characters)
    .flatMap(item => Array(development.constructionCost[item] || 0).fill(item))
}

export function getRemainingCost(construction: Construction): { item: Resource | Character, space: number }[] {
  return getCost(construction.card)
    .map((item, index) => ({item, space: index}))
    .filter(item => !construction.costSpaces[item.space])
}

export function getSpacesMissingItem(construction: Construction, predicate: (item: Resource | Character) => boolean) {
  return getRemainingCost(construction).filter(cost => predicate(cost.item)).map(cost => cost.space)
}

export function couldPlaceResource(construction: Construction, resource: Resource) {
  return Array.from(getCost(construction.card).entries())
    .some(([space, item]) => resource === item && (!construction.costSpaces[space] || construction.costSpaces[space] === Resource.Krystallium))
}

export function getNextProductionStep(game: GameState | GameView) {
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

export function canBuild(player: Player, card: number): boolean {
  const construction = player.constructionArea.find(construction => construction.card === card)
  if (!construction) {
    return false
  }
  return canPay(player, getRemainingCost(construction).map(cost => cost.item))

}

export function canPay(player: Player, cost: (Resource | Character)[]) {
  for (const character of characters) {
    if (player.characters[character] < cost.filter(item => item === character).length) {
      return false
    }
  }
  let krystalliumLeft = player.empireCardResources.filter(resource => resource === Resource.Krystallium).length
  for (const resource of resources) {
    const resourceCost = cost.filter(item => item === resource).length
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
  const construction = player.constructionArea.find(construction => construction.card === card)
    || {card, costSpaces: Array(totalCost(getCardDetails(card))).fill(null)}
  const remainingCost = getRemainingCost(construction)
  for (const resource of resources) {
    const resourceCosts = remainingCost.filter(cost => cost.item === resource)
    let resources = player.availableResources.filter(r => r === resource).length
    for (const cost of resourceCosts) {
      if (resources > 0) {
        moves.push(placeResourceOnConstructionMove(player.empire, resource, card, cost.space))
        resources--
      } else {
        moves.push(placeResourceOnConstructionMove(player.empire, Resource.Krystallium, card, cost.space))
      }
    }
  }
  for (const cost of remainingCost) {
    if (isCharacter(cost.item)) {
      moves.push(placeCharacterMove(player.empire, cost.item, card, cost.space))
    }
  }
  return moves
}

export function isPlaceItemOnCard(move: Move | MoveView, card?: number): move is (PlaceResourceOnConstruction | PlaceCharacter) {
  if (card !== undefined) {
    return isPlaceItemOnCard(move) && move.card === card
  } else {
    return isPlaceResourceOnConstruction(move) || isPlaceCharacter(move)
  }
}

export function isActive(game: GameView, playerId: EmpireName) {
  const player = game.players.find(player => player.empire === playerId)!
  switch (game.phase) {
    case Phase.Draft:
      return isPlayerView(player) ? !player.ready : player.chosenCard === undefined
    case Phase.Planning:
    case Phase.Production:
      return !player.ready
  }
}

export function countCharacters(player: Player | PlayerView) {
  return player.characters[Character.Financier] + player.characters[Character.General]
}

export function isOver(game: GameState | GameView): boolean {
  return game.round === numberOfRounds && game.phase === Phase.Production && game.productionStep === Resource.Exploration && game.players.every(player => player.ready)
}

export function constructionsThatMayReceiveCubes(player: Player | PlayerView): Construction[] {
  return player.constructionArea.filter(construction => getRemainingCost(construction).some(cost => isResource(cost.item) && player.availableResources.includes(cost.item)))
}

export function placeAvailableCubesMoves(player: Player | PlayerView, construction: Construction): PlaceResource[] {
  const moves: PlaceResource[] = []
  const availableResource = JSON.parse(JSON.stringify(player.availableResources)) as Resource[]
  getRemainingCost(construction).forEach(cost => {
    if (isResource(cost.item)) {
      if (availableResource.some(resource => resource === cost.item)) {
        moves.push(placeResourceOnConstructionMove(player.empire, cost.item, construction.card, cost.space))
        availableResource.splice(availableResource.findIndex(resource => resource === cost.item), 1)
      }
    }
  })
  return moves
}

export function isTurnToPlay(state: GameState | GameView, playerId: EmpireName) {
  const player = state.players.find(player => player.empire === playerId)
  if (!player) return false
  switch (state.phase) {
    case Phase.Draft:
      if (isPlayerView(player)) {
        return !player.ready
      } else {
        return player.chosenCard === undefined && player.hand.length > 0
      }
    case Phase.Planning:
    case Phase.Production:
      return !player.ready
  }
}