import { getEnumValues } from '@gamepark/rules-api'

export enum Empire {
  AztecEmpire = 1,
  FederationOfAsia,
  NoramStates,
  PanafricanUnion,
  RepublicOfEurope,
  NationsOfOceania,
  NorthHegemony
}

export const empires = getEnumValues(Empire)
