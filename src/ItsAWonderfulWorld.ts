import Character, {ChooseCharacter} from './material/Character'
import Development from './material/Development'
import Empire from './material/Empire'
import Resource from './material/Resource'

type ItsAWonderfulWorld = {
  players: Player[]
  deck: Development[]
  discard: Development[]
  round: number
  phase: Phase
  productionStep?: Resource
}

export default ItsAWonderfulWorld

export type Player = {
  empire: Empire
  hand: Development[]
  cardsToPass?: Development[]
  chosenCard?: Development | true
  draftArea: Development[]
  constructionArea: DevelopmentUnderConstruction[]
  availableResources: Resource[]
  empireCardResources: Resource[]
  constructedDevelopments: Development[]
  ready: boolean
  characters: { [Character.Financier]: number, [Character.General]: number }
  bonuses: (Resource.Krystallium | Character | typeof ChooseCharacter)[]
}

export type DevelopmentUnderConstruction = {
  development: Development
  costSpaces: (Resource | Character)[]
}

export enum Phase {Draft = 'Draft', Planning = 'Planning', Production = 'Production'}
