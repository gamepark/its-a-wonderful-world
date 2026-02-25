import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseDevelopmentCardHeader } from './ChooseDevelopmentCardHeader'
import { DealDevelopmentCardsHeader } from './DealDevelopmentCardsHeader'
import { PassCardsHeader } from './PassCardsHeader'
import { PlanningHeader } from './PlanningHeader'
import { ProductionHeader } from './ProductionHeader'
import { RevealChosenCardsHeader } from './RevealChosenCardsHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.DealDevelopmentCards]: DealDevelopmentCardsHeader,
  [RuleId.ChooseDevelopmentCard]: ChooseDevelopmentCardHeader,
  [RuleId.RevealChosenCards]: RevealChosenCardsHeader,
  [RuleId.PassCards]: PassCardsHeader,
  [RuleId.Planning]: PlanningHeader,
  [RuleId.MaterialsProduction]: ProductionHeader,
  [RuleId.EnergyProduction]: ProductionHeader,
  [RuleId.ScienceProduction]: ProductionHeader,
  [RuleId.GoldProduction]: ProductionHeader,
  [RuleId.ExplorationProduction]: ProductionHeader,
  [RuleId.KrystalliumProduction]: ProductionHeader
}
