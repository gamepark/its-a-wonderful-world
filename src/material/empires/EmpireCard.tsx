import {css, SerializedStyles} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import Empire from './Empire'
import AztecEmpireA from './aztec-empire-A.png'
import FederationOfAsiaA from './federation-of-asia-A.png'
import NoramStatesA from './noram-states-A.png'
import PanafricanUnionA from './panafrican-union-A.png'
import RepublicOfEuropeA from './republic-of-europe-A.png'

export const width = 23
export const sizeRatio = 65 / 100
export const height = width * sizeRatio

const empireFaceA = {
  [Empire.AztecEmpire]: AztecEmpireA,
  [Empire.FederationOfAsia]: FederationOfAsiaA,
  [Empire.NoramStates]: NoramStatesA,
  [Empire.PanafricanUnion]: PanafricanUnionA,
  [Empire.RepublicOfEurope]: RepublicOfEuropeA
}

const EmpireCard: FunctionComponent<{ empire: Empire, position: SerializedStyles }> = ({empire, position}) => {
  return (
    <div css={css`
      ${position};
      height: ${height}vh;
      width: ${width}vh;
      background-image: url('${empireFaceA[empire]}');
      background-size: cover;
      border-radius: 1vh;
      box-shadow: 0 0 0.1vh white;
    `}>
      <h3 style={{display: 'none'}}>Zeppelin</h3>
    </div>
  )
}

export function getEmpireName(t: TFunction, empire: Empire) {
  switch (empire) {
    case Empire.AztecEmpire:
      return t('Empire d’Azteca')
    case Empire.FederationOfAsia:
      return t('Fédération d’Asie')
    case Empire.NoramStates:
      return t('États du Noram')
    case Empire.PanafricanUnion:
      return t('Union Panafricaine')
    case Empire.RepublicOfEurope:
      return t('République d’Europa')
  }
}

export default EmpireCard