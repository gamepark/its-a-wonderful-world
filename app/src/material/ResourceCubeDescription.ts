import { TokenDescription } from '@gamepark/react-game'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'

// Import cube images
import MaterialsCube from '../images/resources/materials-cube.png'
import EnergyCube from '../images/resources/energy-cube.png'
import ScienceCube from '../images/resources/science-cube.png'
import GoldCube from '../images/resources/gold-cube.png'
import ExplorationCube from '../images/resources/exploration-cube.png'
import KrystalliumCube from '../images/resources/krytallium-cube.png'

/**
 * Resource cube description for the Material system
 * Cubes have a simple ID: Resource enum value
 */
export class ResourceCubeDescription extends TokenDescription {
  width = 0.93
  height = 0.9

  images = {
    [Resource.Materials]: MaterialsCube,
    [Resource.Energy]: EnergyCube,
    [Resource.Science]: ScienceCube,
    [Resource.Gold]: GoldCube,
    [Resource.Exploration]: ExplorationCube,
    [Resource.Krystallium]: KrystalliumCube
  }

  transparency = true
}

export const resourceCubeDescription = new ResourceCubeDescription()
