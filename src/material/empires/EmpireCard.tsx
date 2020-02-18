import {css, SerializedStyles} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Empire from './Empire'
import AztecEmpireA from './aztec-empire-A.png'
import FederationOfAsiaA from './federation-of-asia-A.png'
import NoramStatesA from './noram-states-A.png'
import PanafricanUnionA from './panafrican-union-A.png'
import RepublicOfEuropeA from './republic-of-europe-A.png'

const cardWidth = 22

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
      height: ${cardWidth * 13 / 20}vh;
      width: ${cardWidth}vh;
      background-image: url('${empireFaceA[empire]}');
      background-size: cover;
      border-radius: 1vh;
      box-shadow: 0 0 0.1vh white;
    `}>
      <h3 style={{display: 'none'}}>Zeppelin</h3>
    </div>
  )
}

export default EmpireCard