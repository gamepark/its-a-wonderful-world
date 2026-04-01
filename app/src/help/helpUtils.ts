import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'

export function getDevelopmentTypeName(t: (key: string) => string, type: DevelopmentType): string {
  switch (type) {
    case DevelopmentType.Structure:
      return t('type.structure')
    case DevelopmentType.Vehicle:
      return t('type.vehicle')
    case DevelopmentType.Research:
      return t('type.research')
    case DevelopmentType.Project:
      return t('type.project')
    case DevelopmentType.Discovery:
      return t('type.discovery')
    case DevelopmentType.Memorial:
      return t('type.memorial')
  }
}

export function getResourceName(t: (key: string) => string, resource: Resource): string {
  switch (resource) {
    case Resource.Materials:
      return t('resource.materials')
    case Resource.Energy:
      return t('resource.energy')
    case Resource.Science:
      return t('resource.science')
    case Resource.Gold:
      return t('resource.gold')
    case Resource.Exploration:
      return t('resource.exploration')
    case Resource.Krystallium:
      return t('resource.krystallium')
  }
}
