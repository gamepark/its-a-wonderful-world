import { getEnumValues, OptionsSpecV2 } from '@gamepark/rules-api'
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
  corruptionAndAscension: boolean
  warAndPeace: boolean
  empiresSide: EmpireSide
}

/**
 * What It's a Wonderful World is: two expansions, one empire card side, and one
 * empire per player.
 *
 * Both of the game's rules are about what Corruption & Ascension makes possible,
 * and they are not the same kind of rule, so they are not declared the same way.
 *
 * Turning the expansion off is what caps the table at five, so the `false` side
 * carries a `playerCount` and simply stops being offered above it — enforced
 * before the question is asked.
 *
 * Sides E and F look like the same shape but are not. Declaring them
 * `requires: corruptionAndAscension` would hide them from every host who has not
 * yet ticked the expansion — which is most of them, since the box starts
 * undecided — and two of the six sides would be invisible until you happened to
 * tick something else. They stay listed and the conflict is a cross rule, which
 * is also what keeps the game's own sentence: `face.e.f.requires.c&a` explains
 * the rule, where an absence explains nothing.
 */
export const ItsAWonderfulWorldOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 7 },
  identities: { values: empires },
  options: {
    corruptionAndAscension: { kind: 'boolean', values: [{ value: false, playerCount: { max: 5 } }, true] },
    warAndPeace: { kind: 'boolean' },
    empiresSide: { kind: 'enum', values: getEnumValues(EmpireSide) }
  },
  rules: [
    {
      type: 'forbidden-combination',
      when: [
        { option: 'corruptionAndAscension', values: [false] },
        { option: 'empiresSide', values: [EmpireSide.E, EmpireSide.F] }
      ],
      message: 'face.e.f.requires.c&a'
    }
  ]
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
