import { getEnumValues, OptionsSpec, OptionsSpecV2, OptionsValidationError, TFunction } from '@gamepark/rules-api'
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

/**
 * The legacy declaration, superseded by `ItsAWonderfulWorldOptionsSpecV2`.
 *
 * Kept exported only because a few platform screens still read the v1 spec for
 * its labels and help texts; nothing here should be edited any more, and the
 * whole object goes once those screens have moved.
 *
 * `subscriberRequired` is dead here too: which sides a subscription unlocks is a
 * commercial decision, and it lives in `BoardGame.optionsPolicy` on the platform,
 * which overrides whatever this file says. It is left in place as documentation
 * of the intent, not as something that takes effect.
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
    label: (t) => t('c&a'),
    help: (t) => t('c&a.help'),
    subscriberRequired: true
  },
  warAndPeace: {
    label: (t) => t('w&p'),
    help: (t) => t('w&p.help'),
    subscriberRequired: true
  },
  empiresSide: {
    label: (t) => t('Empire cards side'),
    values: getEnumValues(EmpireSide),
    valueSpec: (side) => ({
      label: (t) => t('Side {side}', { side: String.fromCharCode(64 + (side ?? 1)) }),
      help: (t) => getEmpireSideHelp(side, t),
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

function getEmpireSideHelp(side: EmpireSide, t: TFunction): string {
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
