import { applyAutomaticMoves, MaterialGame } from '@gamepark/rules-api'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Empire } from './Empire'
import { ItsAWonderfulWorldRules } from './ItsAWonderfulWorldRules'
import { ItsAWonderfulWorldSetup } from './ItsAWonderfulWorldSetup'
import { EmpireSide } from './material/EmpireSide'

/**
 * Plays complete games choosing random legal moves, the same way the server does.
 * Any move the rules produce must remain valid when it is finally played: consequences are computed
 * before the previous consequences are applied, so a rule must never plan to move more items than
 * the other consequences of the same move leave available.
 */

/** Deterministic PRNG so that a failing run can be replayed with the same seed */
function prng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
}

const allEmpires = [Empire.AztecEmpire, Empire.FederationOfAsia, Empire.NoramStates, Empire.PanafricanUnion, Empire.RepublicOfEurope]

function playRandomGame(seed: number, playerCount: number) {
  const random = prng(seed)
  const game: MaterialGame = new ItsAWonderfulWorldSetup().setup({
    players: allEmpires.slice(0, playerCount).map((id) => ({ id })),
    corruptionAndAscension: false,
    warAndPeace: false,
    empiresSide: EmpireSide.A
  })

  const rules = new ItsAWonderfulWorldRules(game)
  // The safety bound is only there to never hang the test suite: a game ends way before that.
  for (let step = 0; step < 20000; step++) {
    const activePlayers = game.players.filter((player) => rules.isTurnToPlay(player))
    if (!activePlayers.length) return
    const player = activePlayers[Math.floor(random() * activePlayers.length)]
    const legalMoves = rules.getLegalMoves(player)
    // A player whose turn it is must always have something to play: for instance a player cannot end their
    // turn while they still have available resources, so those resources must always be placeable somewhere
    // or go on the empire card automatically.
    if (!legalMoves.length) throw new Error(`Player ${player} has no legal move on rule ${game.rule?.id}`)
    // Plays the move, its consequences and the automatic moves, exactly like the server does
    applyAutomaticMoves(rules, [legalMoves[Math.floor(random() * legalMoves.length)]])
  }
  throw new Error('The game did not end')
}

describe('Random games', () => {
  let errors: string[] = []
  const consoleError = console.error

  beforeEach(() => {
    errors = []
    // The framework logs errors instead of throwing for deprecated behaviors (moving an item with a
    // quantity without specifying how many): those must never happen either.
    console.error = (...args: unknown[]) => errors.push(String(args[0]))
  })

  afterEach(() => {
    console.error = consoleError
  })

  it(
    'play without any error until the end',
    () => {
      for (let seed = 1; seed <= 20; seed++) {
        for (const playerCount of [2, 5]) {
          expect(() => playRandomGame(seed, playerCount), `seed ${seed}, ${playerCount} players`).not.toThrow()
          expect(errors, `seed ${seed}, ${playerCount} players`).toEqual([])
        }
      }
    },
    // 40 complete games take about 20 seconds
    120_000
  )
})
