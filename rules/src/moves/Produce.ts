import GameState from '../GameState'
import GameView from '../GameView'
import Character, {ChooseCharacter} from '../material/Character'
import Resource from '../material/Resource'
import Player from '../Player'
import PlayerView from '../PlayerView'
import {getProduction} from '../Production'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface Produce {
  type: typeof MoveType.Produce
  resource: Resource
}

export const produceMove = (resource: Resource): Produce => ({type: MoveType.Produce, resource})

export function produce(state: GameState | GameView, move: Produce) {
  state.productionStep = move.resource
  const rankPlayersProduction: { production: number, players: (Player | PlayerView)[] }[] = []
  for (const player of state.players) {
    const production = getProduction(player, move.resource)
    player.availableResources = new Array(production).fill(move.resource)
    player.ready = false
    if (production > 0) {
      for (let i = 0; i <= rankPlayersProduction.length; i++) {
        if (i === rankPlayersProduction.length) {
          rankPlayersProduction.push({production, players: [player]})
          break
        }
        const rank = rankPlayersProduction[i]
        if (rank.production === production) {
          rank.players.push(player)
          break
        }
        if (rank.production < production) {
          rankPlayersProduction.splice(i, 0, {production, players: [player]})
          break
        }
      }
    }
  }
  const supremacySeats = state.players.length >= 6 ? 2 : 1
  const supremacyPlayers: (Player | PlayerView)[] = []
  for (const rank of rankPlayersProduction) {
    if (supremacyPlayers.length + rank.players.length > supremacySeats) break
    supremacyPlayers.push(...rank.players)
  }
  for (const player of supremacyPlayers) {
    switch (move.resource) {
      case Resource.Materials:
      case Resource.Gold:
        player.bonuses.push(Character.Financier)
        break
      case Resource.Energy:
      case Resource.Exploration:
        player.bonuses.push(Character.General)
        break
      default:
        player.bonuses.push(ChooseCharacter)
        break
    }
  }
}

export function isProduce(move: Move | MoveView): move is Produce {
  return move.type === MoveType.Produce
}