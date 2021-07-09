import {isEnumValue} from '@gamepark/rules-api'

enum EmpireSide {A = 1, B, C, D, E, F}

export default EmpireSide

export const empireSides = Object.values(EmpireSide).filter(isEnumValue)