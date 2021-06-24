import OptionsSpec from '@gamepark/rules-api/dist/options/OptionsSpec'
import {TFunction} from 'i18next'
import GameState from './GameState'
import EmpireName from './material/EmpireName'
import EmpireSide from './material/EmpireSide'

export type ItsAWonderfulWorldOptions = {
  players: { id: EmpireName }[],
  empiresSide: EmpireSide,
  corruptionAndAscension: boolean
}

export function isGameOptions(arg: GameState | ItsAWonderfulWorldOptions): arg is ItsAWonderfulWorldOptions {
  return typeof (arg as GameState).round === 'undefined'
}

export const ItsAWonderfulWorldOptionsSpec: OptionsSpec<ItsAWonderfulWorldOptions> = {
  players: {
    id: {
      label: (t: TFunction) => t('Empire'),
      values: Object.values(EmpireName),
      valueLabel: getPlayerName
    }
  },
  empiresSide: {
    label: (t: TFunction) => t('Empire cards side'),
    values: Object.values(EmpireSide),
    valueLabel: (side: EmpireSide, t: TFunction) => t('Side {side}', {side})
  },
  corruptionAndAscension: {
    label: (t: TFunction) => t('Corruption & Ascension')
  }
}

export function getPlayerName(empire: EmpireName, t: TFunction): string {
  switch (empire) {
    case EmpireName.AztecEmpire:
      return t('Aztec Empire')
    case EmpireName.FederationOfAsia:
      return t('Federation of Asia')
    case EmpireName.NoramStates:
      return t('Noram States')
    case EmpireName.PanafricanUnion:
      return t('Panafrican Union')
    case EmpireName.RepublicOfEurope:
      return t('Republic of Europe')
  }
}
