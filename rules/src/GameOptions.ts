import Game from './Game'
import EmpireName from './material/EmpireName'
import EmpireSide from './material/EmpireSide'

type GameOptions = {
  players?: number | { empire?: EmpireName }[]
  empiresSide?: EmpireSide
}

export default GameOptions

export function isGameOptions(arg: Game | GameOptions): arg is GameOptions {
  return typeof (arg as Game).round === 'undefined'
}
