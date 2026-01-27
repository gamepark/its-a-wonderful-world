import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { characterTokenDescription } from './CharacterTokenDescription'
import { developmentCardDescription } from './DevelopmentCardDescription'
import { empireCardDescription } from './EmpireCardDescription'
import { frenchDevelopmentCardDescription } from './FrenchDevelopmentCardDescription'
import { resourceCubeDescription } from './ResourceCubeDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.DevelopmentCard]: developmentCardDescription,
  [MaterialType.EmpireCard]: empireCardDescription,
  [MaterialType.ResourceCube]: resourceCubeDescription,
  [MaterialType.CharacterToken]: characterTokenDescription
}

export const materialI18n: Record<string, Partial<Record<MaterialType, MaterialDescription>>> = {
  fr: {
    [MaterialType.DevelopmentCard]: frenchDevelopmentCardDescription
  }
}
