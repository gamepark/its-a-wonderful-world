import Character, {ChooseCharacter} from '../material/characters/Character'
import Construction from '../material/developments/Construction'
import EmpireName from '../material/empires/EmpireName'
import EmpireSide from '../material/empires/EmpireSide'
import Resource from '../material/resources/Resource'

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