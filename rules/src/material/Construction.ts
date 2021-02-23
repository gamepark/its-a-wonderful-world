import Character from './Character'
import Resource from './Resource'

type Construction = {
  card: number
  costSpaces: (Resource | Character)[]
}

export default Construction