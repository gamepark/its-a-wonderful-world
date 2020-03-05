import Character from '../characters/Character'
import DevelopmentType from '../developments/DevelopmentType'
import Resource from '../resources/Resource'
import Empire from './Empire'
import EmpireAnatomy from './EmpireAnatomy'

const EmpiresFaceA = new Map<Empire, EmpireAnatomy>()

EmpiresFaceA.set(Empire.AztecEmpire, {
  victoryPoints: {[DevelopmentType.Discovery]: 3},
  production: {
    [Resource.Energy]: 2,
    [Resource.Exploration]: 2
  }
})

EmpiresFaceA.set(Empire.FederationOfAsia, {
  victoryPoints: {[DevelopmentType.Project]: 2},
  production: {
    [Resource.Materials]: 1,
    [Resource.Gold]: 2
  }
})

EmpiresFaceA.set(Empire.NoramStates, {
  victoryPoints: {[Character.Financier]: 1},
  production: {
    [Resource.Materials]: 3,
    [Resource.Gold]: 1
  }
})

EmpiresFaceA.set(Empire.PanafricanUnion, {
  victoryPoints: {[DevelopmentType.Research]: 2},
  production: {
    [Resource.Materials]: 2,
    [Resource.Science]: 2
  }
})

EmpiresFaceA.set(Empire.RepublicOfEurope, {
  victoryPoints: {[Character.General]: 1},
  production: {
    [Resource.Materials]: 2,
    [Resource.Energy]: 1,
    [Resource.Science]: 1
  }
})

export default EmpiresFaceA