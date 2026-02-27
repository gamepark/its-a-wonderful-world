/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { getPlayerName } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldOptions'
import { EmpireSide } from '@gamepark/its-a-wonderful-world/material/EmpireSide'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { CardDescription, MaterialContext } from '@gamepark/react-game'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

// Aztec Empire
import AztecEmpireA from '../images/empires/aztec-empire-A.jpg'
import AztecEmpireB from '../images/empires/aztec-empire-B.jpg'
import AztecEmpireC from '../images/empires/aztec-empire-C.jpg'
import AztecEmpireD from '../images/empires/aztec-empire-D.jpg'
import AztecEmpireE from '../images/empires/aztec-empire-E.jpg'
import AztecEmpireF from '../images/empires/aztec-empire-F.jpg'

// Federation of Asia
import FederationOfAsiaA from '../images/empires/federation-of-asia-A.jpg'
import FederationOfAsiaB from '../images/empires/federation-of-asia-B.jpg'
import FederationOfAsiaC from '../images/empires/federation-of-asia-C.jpg'
import FederationOfAsiaD from '../images/empires/federation-of-asia-D.jpg'
import FederationOfAsiaE from '../images/empires/federation-of-asia-E.jpg'
import FederationOfAsiaF from '../images/empires/federation-of-asia-F.jpg'

// Nations of Oceania
import NationsOfOceaniaA from '../images/empires/nations-of-oceania-A.jpg'
import NationsOfOceaniaB from '../images/empires/nations-of-oceania-B.jpg'
import NationsOfOceaniaC from '../images/empires/nations-of-oceania-C.jpg'
import NationsOfOceaniaD from '../images/empires/nations-of-oceania-D.jpg'
import NationsOfOceaniaE from '../images/empires/nations-of-oceania-E.jpg'
import NationsOfOceaniaF from '../images/empires/nations-of-oceania-F.jpg'

// Noram States
import NoramStatesA from '../images/empires/noram-states-A.jpg'
import NoramStatesB from '../images/empires/noram-states-B.jpg'
import NoramStatesC from '../images/empires/noram-states-C.jpg'
import NoramStatesD from '../images/empires/noram-states-D.jpg'
import NoramStatesE from '../images/empires/noram-states-E.jpg'
import NoramStatesF from '../images/empires/noram-states-F.jpg'

// North Hegemony
import NorthHegemonyA from '../images/empires/north-hegemony-A.jpg'
import NorthHegemonyB from '../images/empires/north-hegemony-B.jpg'
import NorthHegemonyC from '../images/empires/north-hegemony-C.jpg'
import NorthHegemonyD from '../images/empires/north-hegemony-D.jpg'
import NorthHegemonyE from '../images/empires/north-hegemony-E.jpg'
import NorthHegemonyF from '../images/empires/north-hegemony-F.jpg'

// Panafrican Union
import PanafricanUnionA from '../images/empires/panafrican-union-A.jpg'
import PanafricanUnionB from '../images/empires/panafrican-union-B.jpg'
import PanafricanUnionC from '../images/empires/panafrican-union-C.jpg'
import PanafricanUnionD from '../images/empires/panafrican-union-D.jpg'
import PanafricanUnionE from '../images/empires/panafrican-union-E.jpg'
import PanafricanUnionF from '../images/empires/panafrican-union-F.jpg'

// Republic of Europe
import RepublicOfEuropeA from '../images/empires/republic-of-europe-A.jpg'
import RepublicOfEuropeB from '../images/empires/republic-of-europe-B.jpg'
import RepublicOfEuropeC from '../images/empires/republic-of-europe-C.jpg'
import RepublicOfEuropeD from '../images/empires/republic-of-europe-D.jpg'
import RepublicOfEuropeE from '../images/empires/republic-of-europe-E.jpg'
import RepublicOfEuropeF from '../images/empires/republic-of-europe-F.jpg'

type EmpireCardId = { empire: Empire; side: EmpireSide }

// Helper to compute a flat key from empire and side
const empireKey = (empire: Empire, side: EmpireSide) => empire * 10 + side

/**
 * Empire card description for the Material system.
 * Empire cards are static items - they are created via getStaticItems based on
 * the players and the memorized empire side.
 */
export class EmpireCardDescription extends CardDescription<Empire, MaterialType, LocationType, EmpireCardId> {
  // Empire cards are landscape with ratio 400/343 ≈ 1.166 (width/height)
  // Proportionally similar to v2: empire width ≈ 1.07x development width
  // Development card is 6.5 x 10, so empire is approximately 7 x 6
  width = 7
  height = (7 * 343) / 400 // ≈ 6
  borderRadius = 0.3

  // Flat images structure using computed keys
  images = {
    [empireKey(Empire.AztecEmpire, EmpireSide.A)]: AztecEmpireA,
    [empireKey(Empire.AztecEmpire, EmpireSide.B)]: AztecEmpireB,
    [empireKey(Empire.AztecEmpire, EmpireSide.C)]: AztecEmpireC,
    [empireKey(Empire.AztecEmpire, EmpireSide.D)]: AztecEmpireD,
    [empireKey(Empire.AztecEmpire, EmpireSide.E)]: AztecEmpireE,
    [empireKey(Empire.AztecEmpire, EmpireSide.F)]: AztecEmpireF,
    [empireKey(Empire.FederationOfAsia, EmpireSide.A)]: FederationOfAsiaA,
    [empireKey(Empire.FederationOfAsia, EmpireSide.B)]: FederationOfAsiaB,
    [empireKey(Empire.FederationOfAsia, EmpireSide.C)]: FederationOfAsiaC,
    [empireKey(Empire.FederationOfAsia, EmpireSide.D)]: FederationOfAsiaD,
    [empireKey(Empire.FederationOfAsia, EmpireSide.E)]: FederationOfAsiaE,
    [empireKey(Empire.FederationOfAsia, EmpireSide.F)]: FederationOfAsiaF,
    [empireKey(Empire.NoramStates, EmpireSide.A)]: NoramStatesA,
    [empireKey(Empire.NoramStates, EmpireSide.B)]: NoramStatesB,
    [empireKey(Empire.NoramStates, EmpireSide.C)]: NoramStatesC,
    [empireKey(Empire.NoramStates, EmpireSide.D)]: NoramStatesD,
    [empireKey(Empire.NoramStates, EmpireSide.E)]: NoramStatesE,
    [empireKey(Empire.NoramStates, EmpireSide.F)]: NoramStatesF,
    [empireKey(Empire.PanafricanUnion, EmpireSide.A)]: PanafricanUnionA,
    [empireKey(Empire.PanafricanUnion, EmpireSide.B)]: PanafricanUnionB,
    [empireKey(Empire.PanafricanUnion, EmpireSide.C)]: PanafricanUnionC,
    [empireKey(Empire.PanafricanUnion, EmpireSide.D)]: PanafricanUnionD,
    [empireKey(Empire.PanafricanUnion, EmpireSide.E)]: PanafricanUnionE,
    [empireKey(Empire.PanafricanUnion, EmpireSide.F)]: PanafricanUnionF,
    [empireKey(Empire.RepublicOfEurope, EmpireSide.A)]: RepublicOfEuropeA,
    [empireKey(Empire.RepublicOfEurope, EmpireSide.B)]: RepublicOfEuropeB,
    [empireKey(Empire.RepublicOfEurope, EmpireSide.C)]: RepublicOfEuropeC,
    [empireKey(Empire.RepublicOfEurope, EmpireSide.D)]: RepublicOfEuropeD,
    [empireKey(Empire.RepublicOfEurope, EmpireSide.E)]: RepublicOfEuropeE,
    [empireKey(Empire.RepublicOfEurope, EmpireSide.F)]: RepublicOfEuropeF,
    [empireKey(Empire.NationsOfOceania, EmpireSide.A)]: NationsOfOceaniaA,
    [empireKey(Empire.NationsOfOceania, EmpireSide.B)]: NationsOfOceaniaB,
    [empireKey(Empire.NationsOfOceania, EmpireSide.C)]: NationsOfOceaniaC,
    [empireKey(Empire.NationsOfOceania, EmpireSide.D)]: NationsOfOceaniaD,
    [empireKey(Empire.NationsOfOceania, EmpireSide.E)]: NationsOfOceaniaE,
    [empireKey(Empire.NationsOfOceania, EmpireSide.F)]: NationsOfOceaniaF,
    [empireKey(Empire.NorthHegemony, EmpireSide.A)]: NorthHegemonyA,
    [empireKey(Empire.NorthHegemony, EmpireSide.B)]: NorthHegemonyB,
    [empireKey(Empire.NorthHegemony, EmpireSide.C)]: NorthHegemonyC,
    [empireKey(Empire.NorthHegemony, EmpireSide.D)]: NorthHegemonyD,
    [empireKey(Empire.NorthHegemony, EmpireSide.E)]: NorthHegemonyE,
    [empireKey(Empire.NorthHegemony, EmpireSide.F)]: NorthHegemonyF
  }

  content = (props: { itemId: EmpireCardId, children?: ReactNode }) => {
    return this.contentWithBackChildren({
      ...props,
      children: <>{props.children}<EmpireCardTitle itemId={props.itemId}/></>
    })
  }

  protected getFrontId(itemId: EmpireCardId) {
    if (!itemId) return undefined
    return empireKey(itemId.empire, itemId.side)
  }

  /**
   * Generate static empire cards for each player based on memorized empire side.
   * Only show the card for the current view player.
   */
  getStaticItems(context: MaterialContext<Empire, MaterialType, LocationType>) {
    const empireSide = context.rules.remind<EmpireSide>(Memory.EmpireSide) ?? EmpireSide.A
    const currentView = context.rules.game.view ?? context.player ?? context.rules.players[0]

    // Only show the empire card of the currently viewed player
    if (currentView === undefined) return []

    return [
      {
        id: { empire: currentView, side: empireSide },
        location: { type: LocationType.EmpireCardSpace, player: currentView }
      }
    ]
  }
}

const EmpireCardTitle = ({ itemId }: { itemId: EmpireCardId }) => {
  const { t } = useTranslation()
  if (!itemId) return null
  const letter = String.fromCharCode(64 + itemId.side)
  return (
    <span css={empireCardTitleStyle}>
      ({letter}) {getPlayerName(itemId.empire, t)}
    </span>
  )
}

const empireCardTitleStyle = css`
  position: absolute;
  bottom: 11%;
  left: 6%;
  width: 80%;
  color: #EEE;
  text-align: center;
  font-size: 0.5em;
  font-weight: lighter;
  text-shadow: 0 0 0.3em #000, 0 0 0.3em #000;
  text-transform: uppercase;
  pointer-events: none;
`

export const empireCardDescription = new EmpireCardDescription()
