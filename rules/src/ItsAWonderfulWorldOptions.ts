import { getEnumValues, OptionsSpec } from '@gamepark/rules-api'
import { Empire, empires } from './Empire'
import { EmpireSide } from './material/EmpireSide'

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = { id: Empire }

/**
 * This is the type of object that the game receives when a new game is started.
 */
export type ItsAWonderfulWorldOptions = {
  players: PlayerOptions[]
  corruptionAndAscension?: boolean
  empiresSide?: EmpireSide
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for your game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const ItsAWonderfulWorldOptionsSpec: OptionsSpec<ItsAWonderfulWorldOptions> = {
  players: {
    id: {
      label: (t) => t('Empire'),
      values: empires,
      valueSpec: (empire) => ({ label: (t) => getPlayerName(empire, t) })
    }
  },
  corruptionAndAscension: {
    label: (t) => t('Corruption & Ascension'),
    values: [false, true],
    valueSpec: (value) => ({ label: (t) => (value ? t('Yes') : t('No')) }),
    subscriberRequired: false
  },
  empiresSide: {
    label: (t) => t('Empire cards side'),
    values: getEnumValues(EmpireSide),
    valueSpec: (side) => ({
      label: (t) => t('Side {side}', { side: String.fromCharCode(64 + (side ?? 1)) })
    })
  }
}

export function getPlayerName(empire: Empire, t: (key: string) => string): string {
  switch (empire) {
    case Empire.AztecEmpire:
      return t('Aztec Empire')
    case Empire.FederationOfAsia:
      return t('Federation of Asia')
    case Empire.NoramStates:
      return t('Noram States')
    case Empire.PanafricanUnion:
      return t('Panafrican Union')
    case Empire.RepublicOfEurope:
      return t('Republic of Europe')
    case Empire.NationsOfOceania:
      return t('Nations of Oceania')
    case Empire.NorthHegemony:
      return t('North Hegemony')
  }
}
