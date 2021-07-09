import {isEnumValue} from '@gamepark/rules-api'

enum EmpireName {
  AztecEmpire = 1, FederationOfAsia, NoramStates, PanafricanUnion, RepublicOfEurope, NationsOfOceania, NorthHegemony
}

export default EmpireName

export const empireNames = Object.values(EmpireName).filter(isEnumValue)