import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { and, isRule, MaterialContext, MaterialGameAnimations } from '@gamepark/react-game'
import { isCreateItemType, isDeleteItemType, isDeleteItemTypeAtOnce, isMoveItemType, isMoveItemTypeAtOnce, MaterialMove } from '@gamepark/rules-api'
import { handFaceDownLocator } from '../locators/HandFaceDownLocator'
import { onPlayerPanelLocator } from '../locators/OnPlayerPanelLocator'
import { revealedCardLocator } from '../locators/RevealedCardLocator'

export const gameAnimations = new MaterialGameAnimations()

// Helper: get the player whose perspective we're viewing
const getViewPlayer = (context: MaterialContext): Empire => context.rules.game.view ?? context.player ?? context.rules.players[0]

// Deal phase: only animate cards dealt to the viewing player
const isDealToViewedHand = and(
  isRule(RuleId.DealDevelopmentCards),
  (move, context) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.player === getViewPlayer(context)
)
gameAnimations.configure(isDealToViewedHand).duration(200)
gameAnimations.configure(isRule(RuleId.DealDevelopmentCards)).skip()

// Helper: get next/previous player in pass direction
function getPassNeighbors(context: MaterialContext) {
  const viewPlayer = getViewPlayer(context)
  const round = context.rules.remind<number>(Memory.Round)
  const isClockwise = round % 2 === 1
  const players = context.rules.players
  const playerIndex = players.indexOf(viewPlayer)
  const nextPlayer = players[isClockwise ? (playerIndex + 1) % players.length : (playerIndex - 1 + players.length) % players.length]
  const prevPlayer = players[isClockwise ? (playerIndex - 1 + players.length) % players.length : (playerIndex + 1) % players.length]
  return { nextPlayer, prevPlayer }
}

// Pass phase - SEND: cards leaving viewed player's hand (pre-move animation)
const isMyPassSend = and(isRule(RuleId.PassCards), (move, context) => {
  if (!isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move)) return false
  const viewPlayer = getViewPlayer(context)
  if (move.location.player === viewPlayer) return false // receive, not send
  const item = context.rules.material(MaterialType.DevelopmentCard).getItem(move.indexes[0])
  return item?.location?.player === viewPlayer
})
gameAnimations
  .configure(isMyPassSend)
  .duration(1000)
  .trajectory((context) => {
    const { nextPlayer } = getPassNeighbors(context)
    return {
      waypoints: [
        { at: 0.5, locator: handFaceDownLocator, location: (item) => ({ x: item.location.x }) },
        { at: 1, locator: onPlayerPanelLocator, location: (item) => ({ player: nextPlayer, x: item.location.x, rotation: true }) }
      ]
    }
  })

// Pass phase - RECEIVE: cards arriving to viewed player's hand (post-move animation)
const isMyPassReceive = and(isRule(RuleId.PassCards), (move, context) => {
  if (!isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move)) return false
  return move.location.player === getViewPlayer(context)
})
gameAnimations
  .configure(isMyPassReceive)
  .duration(1000)
  .postMove()
  .trajectory((context) => {
    const { prevPlayer } = getPassNeighbors(context)
    return {
      waypoints: [
        { at: 0, locator: onPlayerPanelLocator, location: (item) => ({ player: prevPlayer, x: item.location.x, rotation: true }) },
        { at: 0.5, locator: handFaceDownLocator, location: (item) => ({ x: item.location.x }) }
      ]
    }
  })

// Skip all other pass moves
gameAnimations.configure(isRule(RuleId.PassCards)).skip()

// Reveal phase - other players' drafted cards: card peeks out from panel at full size
// v2 per-card duration was ~1.75s; we use 2500ms for the panel→full-size→panel peek
const isOtherPlayerReveal = (move: any, context: MaterialContext) => {
  if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return false
  if (move.location?.type !== LocationType.DraftArea) return false
  if (move.location?.rotation !== true) return false
  return move.location?.player !== getViewPlayer(context)
}
gameAnimations
  .configure(isOtherPlayerReveal)
  .duration(2000)
  .trajectory({
    waypoints: [
      { at: 0, locator: onPlayerPanelLocator, location: (item) => ({ player: item.location.player, rotation: true }) },
      { at: 0.2, locator: revealedCardLocator, location: (item) => ({ player: item.location.player }) },
      { at: 0.8, locator: revealedCardLocator, location: (item) => ({ player: item.location.player }) },
      { at: 1, locator: onPlayerPanelLocator, location: (item) => ({ player: item.location.player }) }
    ]
  })

// Discard by other players: animate from their player panel to the discard pile
const isOtherPlayerDiscard = (move: any, context: MaterialContext) => {
  if (move.location?.type !== LocationType.Discard) return false
  if (isMoveItemType(MaterialType.DevelopmentCard)(move)) {
    const item = context.rules.material(MaterialType.DevelopmentCard).getItem(move.itemIndex)
    return item?.location?.player !== undefined && item.location.player !== getViewPlayer(context)
  }
  if (isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move)) {
    const item = context.rules.material(MaterialType.DevelopmentCard).getItem(move.indexes[0])
    return item?.location?.player !== undefined && item.location.player !== getViewPlayer(context)
  }
  return false
}
gameAnimations
  .configure(isOtherPlayerDiscard)
  .duration(500)
  .trajectory({
    waypoints: [
      { at: 0, locator: onPlayerPanelLocator, location: (item) => ({ player: item.location.player }) }
    ]
  })

// Skip animations for cards moving to other players' draft area (choose phase)
const isOtherPlayerDraftCard = (move: any, context: MaterialContext) => {
  if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return false
  return move.location?.type === LocationType.DraftArea && move.location?.player !== getViewPlayer(context)
}
gameAnimations.configure(isOtherPlayerDraftCard).skip()

// Skip reveal animation for the viewing player's own drafted card (they already see it)
const isMyReveal = (move: any, context: MaterialContext) => {
  if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return false
  if (move.location?.type !== LocationType.DraftArea) return false
  if (move.location?.rotation !== true) return false
  return move.location?.player === context.player
}
gameAnimations.configure(isMyReveal).skip()

// Skip animations for cards moving to another player's area (construction, constructed, etc.)
const isCardToOtherPlayerArea = (move: any, context: MaterialContext) => {
  if (!isMoveItemType(MaterialType.DevelopmentCard)(move) && !isMoveItemTypeAtOnce(MaterialType.DevelopmentCard)(move)) return false
  return move.location?.player !== undefined && move.location.player !== getViewPlayer(context)
}
gameAnimations.configure(isCardToOtherPlayerArea).skip()

// Skip animations for cubes moved or created for other players
const isOtherPlayerCube = (move: any, context: MaterialContext) => {
  if (isMoveItemType(MaterialType.ResourceCube)(move)) {
    return move.location?.player !== undefined && move.location.player !== getViewPlayer(context)
  }
  if (isCreateItemType(MaterialType.ResourceCube)(move)) {
    return move.item?.location?.player !== undefined && move.item.location.player !== getViewPlayer(context)
  }
  return false
}
gameAnimations.configure(isOtherPlayerCube).skip()

// Character tokens: skip moves to other players' constructions, animate creates toward their panel
const isOtherPlayerTokenMove = (move: MaterialMove, context: MaterialContext) => {
  if (!isMoveItemType(MaterialType.CharacterToken)(move)) return false
  return move.location?.player !== undefined && move.location.player !== getViewPlayer(context)
}
gameAnimations.configure(isOtherPlayerTokenMove).skip()

const isOtherPlayerTokenCreate = (move: MaterialMove, context: MaterialContext) => {
  if (!isCreateItemType(MaterialType.CharacterToken)(move)) return false
  return move.item?.location?.player !== undefined && move.item.location.player !== getViewPlayer(context)
}
gameAnimations
  .configure(isOtherPlayerTokenCreate)
  .duration(500)
  .trajectory({
    waypoints: [
      { at: 1, locator: onPlayerPanelLocator, location: (item) => ({ player: item.location.player }) }
    ]
  })

// Krystallium creation (from cube transformation): 300ms
const isCreateKrystallium = (move: MaterialMove) =>
  isCreateItemType(MaterialType.ResourceCube)(move) && move.item?.location?.type === LocationType.KrystalliumStock
gameAnimations.configure(isCreateKrystallium).duration(300)

// Viewed player animations (other-player skip rules above take priority)
gameAnimations.configure(isCreateItemType(MaterialType.ResourceCube)).duration(200)
gameAnimations.configure(isDeleteItemType(MaterialType.ResourceCube)).duration(200)
gameAnimations.configure(isDeleteItemTypeAtOnce(MaterialType.ResourceCube)).duration(300)
gameAnimations.configure(isMoveItemType(MaterialType.ResourceCube)).duration(200)
gameAnimations.configure(isMoveItemType(MaterialType.DevelopmentCard)).duration(500)
gameAnimations.configure(isCreateItemType(MaterialType.CharacterToken)).duration(500)
