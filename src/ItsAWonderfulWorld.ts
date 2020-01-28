import DevelopmentAnatomy from './material/DevelopmentAnatomy'
import Empire from './material/Empire'

type ItsAWonderfulWorld = {
  players: PlayersMap,
  deck: (DevelopmentAnatomy | {})[],
  round: number,
  phase: Phase
}

export default ItsAWonderfulWorld

export type PlayersMap = { [key in Empire]?: Player }

export type Player = {
  hand: (DevelopmentAnatomy | {})[]
}

export enum Phase {Draft = 'Draft', Planning = 'Planning', Production = 'Production'}