/** @jsxImportSource @emotion/react */
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { ResourceCubeHelp } from '../help/ResourceCubeHelp'
import { WonderfulMenuButton } from '../theme/WonderfulMenuButton'

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

  help = ResourceCubeHelp

  images = {
    [Resource.Materials]: MaterialsCube,
    [Resource.Energy]: EnergyCube,
    [Resource.Science]: ScienceCube,
    [Resource.Gold]: GoldCube,
    [Resource.Exploration]: ExplorationCube,
    [Resource.Krystallium]: KrystalliumCube
  }

  transparency = true

  isMenuAlwaysVisible(item: MaterialItem) {
    return item.location.type === LocationType.AvailableResources
  }

  /**
   * A button beside each pile of available resources, to put one of its cubes on the Empire card, where 5 cubes make a Krystallium.
   * It hangs on the cube at the center of the pile, below right of its circle.
   */
  getItemMenu(item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    if (item.location.type !== LocationType.AvailableResources || context.displayIndex !== 0) return null
    const move = legalMoves.find(
      (move) => isMoveItemType(MaterialType.ResourceCube)(move) && move.itemIndex === context.index && move.location.type === LocationType.EmpireCardResources
    )
    if (!move) return null
    return (
      <WonderfulMenuButton move={move} x={2.6} y={2.3} title="ui.place-on-empire">
        <FontAwesomeIcon icon={faXmark} />
      </WonderfulMenuButton>
    )
  }
}

export const resourceCubeDescription = new ResourceCubeDescription()
