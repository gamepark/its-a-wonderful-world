import Character, {ChooseCharacter} from './material/Character'
import Construction from './material/Construction'
import EmpireName from './material/EmpireName'
import EmpireSide from './material/EmpireSide'
import Resource from './material/Resource'

type Player = {
  empire: EmpireName
  empireSide: EmpireSide
  hand: number[]
  cardsToPass?: number[]
  chosenCard?: number
  draftArea: number[]
  constructionArea: Construction[]
  availableResources: Resource[]
  empireCardResources: Resource[]
  constructedDevelopments: number[]
  ready: boolean
  characters: { [key in Character]: number }
  bonuses: (Resource | Character | typeof ChooseCharacter)[]
  eliminated?: number
}

export default Player