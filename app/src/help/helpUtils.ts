import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'

export function getDevelopmentTypeName(t: (key: string) => string, type: DevelopmentType): string {
  switch (type) {
    case DevelopmentType.Structure:
      return t('Structure')
    case DevelopmentType.Vehicle:
      return t('Vehicle')
    case DevelopmentType.Research:
      return t('Research')
    case DevelopmentType.Project:
      return t('Project')
    case DevelopmentType.Discovery:
      return t('Discovery')
    case DevelopmentType.Memorial:
      return t('Memorial')
  }
}

export function getResourceName(t: (key: string) => string, resource: Resource): string {
  switch (resource) {
    case Resource.Materials:
      return t('Materials')
    case Resource.Energy:
      return t('Energy')
    case Resource.Science:
      return t('Science')
    case Resource.Gold:
      return t('Gold')
    case Resource.Exploration:
      return t('Exploration')
    case Resource.Krystallium:
      return t('Krystallium')
  }
}
