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
  chosenCard?: number | true
  draftArea: number[]
  constructionArea: DevelopmentUnderConstruction[]
  availableResources: Resource[]
  empireCardResources: Resource[]
  constructedDevelopments: number[]
  ready: boolean
  characters: { [Character.Financier]: number, [Character.General]: number }
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