import Resource from '../resources/Resource'
import Empire from './Empire'

const EmpiresProductionA = new Map<Empire, { [key in Resource]?: number }>()

EmpiresProductionA.set(Empire.AztecEmpire, {
  [Resource.Energy]: 2,
  [Resource.Exploration]: 2
})

EmpiresProductionA.set(Empire.FederationOfAsia, {
  [Resource.Materials]: 1,
  [Resource.Gold]: 2
})

EmpiresProductionA.set(Empire.NoramStates, {
  [Resource.Materials]: 3,
  [Resource.Gold]: 1
})

EmpiresProductionA.set(Empire.PanafricanUnion, {
  [Resource.Materials]: 2,
  [Resource.Science]: 2
})

EmpiresProductionA.set(Empire.RepublicOfEurope, {
  [Resource.Materials]: 2,
  [Resource.Energy]: 1,
  [Resource.Science]: 1
})

export default EmpiresProductionA