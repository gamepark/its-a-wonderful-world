import OptionsSpec from '@gamepark/rules-api/dist/options/OptionsSpec'
import {TFunction} from 'i18next'
import GameState from './GameState'
import EmpireName from './material/EmpireName'
import EmpireSide from './material/EmpireSide'

export type ItsAWonderfulWorldOptions = {
  players: { id: EmpireName }[],
  empiresSide: EmpireSide,
  //corruptionAndAscension: boolean
}

export function isGameOptions(arg: GameState | ItsAWonderfulWorldOptions): arg is ItsAWonderfulWorldOptions {
  return typeof (arg as GameState).round === 'undefined'
}

export const ItsAWonderfulWorldOptionsSpec: OptionsSpec<ItsAWonderfulWorldOptions> = {
  players: {
    id: {
      label: t => t('Empire'),
      values: Object.values(EmpireName),
      valueSpec: empire => ({label: t => getPlayerName(empire, t)})
    }
  },
  empiresSide: {
    label: t => t('Empire cards side'),
    values: Object.values(EmpireSide),
    valueSpec: side => ({
      label: t => t('Side {side}', {side}),
      help: t => getEmpireSideHelp(side, t),
      warn: t => side === EmpireSide.A ? t('Side A is advised for beginners') : '',
      subscriberRequired: side !== EmpireSide.A && side !== EmpireSide.B
    })
  }
  /*corruptionAndAscension: {
    label: (t: TFunction) => t('Corruption & Ascension')
  }*/
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

function getEmpireSideHelp(side: EmpireSide, t: TFunction) {
  switch (side) {
    case EmpireSide.A:
      return t('sideA.help')
    case EmpireSide.B:
      return t('sideB.help')
    case EmpireSide.C:
      return t('sideC.help')
    case EmpireSide.D:
      return t('sideD.help')
  }
}