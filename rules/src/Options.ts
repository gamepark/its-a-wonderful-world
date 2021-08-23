import {OptionsValidationError} from '@gamepark/rules-api'
import OptionsSpec from '@gamepark/rules-api/dist/options/OptionsSpec'
import {TFunction} from 'i18next'
import GameState from './GameState'
import EmpireName, {empireNames} from './material/EmpireName'
import EmpireSide, {empireSides} from './material/EmpireSide'

export type ItsAWonderfulWorldOptions = {
  players: { id: EmpireName }[],
  empiresSide: EmpireSide,
  corruptionAndAscension: boolean
}

export function isGameOptions(arg: GameState | ItsAWonderfulWorldOptions): arg is ItsAWonderfulWorldOptions {
  return typeof (arg as GameState).round === 'undefined'
}

export const ItsAWonderfulWorldOptionsSpec: OptionsSpec<ItsAWonderfulWorldOptions> = {
  corruptionAndAscension: {
    label: t => t('Corruption & Ascension'),
    help: t => t('c&a.help'),
    subscriberRequired: true
  },
  players: {
    id: {
      label: t => t('Empire'),
      values: empireNames,
      valueSpec: empire => ({
        label: t => getPlayerName(empire, t)
      })
    }
  },
  empiresSide: {
    label: t => t('Empire cards side'),
    values: empireSides,
    valueSpec: side => ({
      label: t => t('Side {side}', {side: String.fromCharCode(64 + side)}),
      help: t => getEmpireSideHelp(side, t),
      warn: t => side === EmpireSide.A ? t('Side A is advised for beginners') : '',
      subscriberRequired: side !== EmpireSide.A && side !== EmpireSide.B
    })
  },
  validate: (options, t) => {
    if (options.corruptionAndAscension === false) {
      if (options.players && options.players.length > 5) {
        throw new OptionsValidationError(t('6.players.requires.c&a'), ['corruptionAndAscension', 'players'])
      }
      if (options.empiresSide === EmpireSide.E || options.empiresSide === EmpireSide.F) {
        throw new OptionsValidationError(t('face.e.f.requires.c&a'), ['corruptionAndAscension', 'empiresSide'])
      }
    }
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
    case EmpireName.NationsOfOceania:
      return t('Nations of Oceania')
    case EmpireName.NorthHegemony:
      return t('North Hegemony')
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
    case EmpireSide.E:
      return t('sideE.help')
    case EmpireSide.F:
      return t('sideF.help')
  }
}