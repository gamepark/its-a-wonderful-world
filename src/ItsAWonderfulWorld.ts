import Development from './material/Development'
import Empire from './material/Empire'

type ItsAWonderfulWorld = {
  players: PlayersMap,
  deck: Development[],
  round: number,
  phase: Phase
}

export default ItsAWonderfulWorld

export type PlayersMap = { [key in Empire]?: Player }

export type Player = {
  hand: Development[]
}

export enum Phase {Draft = 'Draft', Planning = 'Planning', Production = 'Production'}