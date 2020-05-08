import Character, {ChooseCharacter} from './material/characters/Character'
import EmpireName from './material/empires/EmpireName'
import Resource from './material/resources/Resource'

type ItsAWonderfulWorld = {
  players: Player[]
  deck: number[]
  discard: number[]
  round: number
  phase: Phase
  productionStep?: Resource
}

export default ItsAWonderfulWorld

export type Player = {
  empire: EmpireName
  empireSide: EmpireSide
  hand: number[]
  cardsToPass?: number[]
  chosenCard?: number
  draftArea: number[]
  constructionArea: DevelopmentUnderConstruction[]
  availableResources: Resource[]
  empireCardResources: Resource[]
  constructedDevelopments: number[]
  ready: boolean
  characters: { [key in Character]: number }
  bonuses: (Resource | Character | typeof ChooseCharacter)[]
}

export type DevelopmentUnderConstruction = {
  card: number
  costSpaces: (Resource | Character)[]
}

export enum Phase {Draft = 'Draft', Planning = 'Planning', Production = 'Production'}

export type Options = {
  players?: number
  empiresSide?: EmpireSide
}

export enum EmpireSide {A = 'A', B = 'B'}

export type ItsAWonderfulWorldView = Omit<ItsAWonderfulWorld, 'deck' | 'players'> & {
  deck: number
  players: (Player | PlayerView)[]
}

export type PlayerView = Omit<Player, 'hand' | 'chosenCard' | 'cardsToPass'> & {
  hand: number
  chosenCard: boolean
}

export function isGameView(game: ItsAWonderfulWorld | ItsAWonderfulWorldView): game is ItsAWonderfulWorldView {
  return typeof game.deck === 'number'
}

export function isPlayer(player: Player | PlayerView): player is Player {
  return Array.isArray(player.hand)
}

export function isPlayerView(player: Player | PlayerView): player is PlayerView {
  return typeof player.hand === 'number'
}