import Character from '../characters/Character'
import Resource from '../resources/Resource'

type Construction = {
  card: number
  costSpaces: (Resource | Character)[]
}

export default Construction