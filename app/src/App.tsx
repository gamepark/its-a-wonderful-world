import { css, Global } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { FailuresDialog, FullscreenDialog, LoadingScreen, MaterialGameSounds, MaterialHeader, MaterialImageLoader, Menu, useGame, usePlayerId } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { useEffect, useState } from 'react'
import { GameDisplay } from './GameDisplay'
import { Headers } from './headers/Headers'

// Import empire background artworks
import AztecEmpireArtwork from './images/empires/aztec-empire-artwork.jpg'
import FederationOfAsiaArtwork from './images/empires/federation-of-asia-artwork.jpg'
import NoramStatesArtwork from './images/empires/noram-states-artwork.jpg'
import PanafricanUnionArtwork from './images/empires/panafrican-union-artwork.jpg'
import RepublicOfEuropeArtwork from './images/empires/republic-of-europe-artwork.jpg'
import NationsOfOceaniaArtwork from './images/empires/nations-of-oceania-artwork.jpg'
import NorthHegemonyArtwork from './images/empires/north-hegemony-artwork.jpg'

// Mapping of Empire to background artwork
const empireBackgrounds: Record<Empire, string> = {
  [Empire.AztecEmpire]: AztecEmpireArtwork,
  [Empire.FederationOfAsia]: FederationOfAsiaArtwork,
  [Empire.NoramStates]: NoramStatesArtwork,
  [Empire.PanafricanUnion]: PanafricanUnionArtwork,
  [Empire.RepublicOfEurope]: RepublicOfEuropeArtwork,
  [Empire.NationsOfOceania]: NationsOfOceaniaArtwork,
  [Empire.NorthHegemony]: NorthHegemonyArtwork
}

export function App() {
  const game = useGame<MaterialGame>()
  const playerId = usePlayerId<Empire>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [isImagesLoading, setImagesLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), process.env.NODE_ENV === 'development' ? 0 : 2000)
  }, [])
  const loading = !game || isJustDisplayed || isImagesLoading

  // Get the currently displayed player (from view, or current player, or first player)
  const displayedPlayer = game?.view ?? playerId ?? game?.players[0]
  const backgroundImage = displayedPlayer !== undefined ? empireBackgrounds[displayedPlayer as Empire] : undefined

  return (
    <>
      <Global styles={backgroundStyle(backgroundImage)} />
      {!!game && <GameDisplay />}
      <LoadingScreen display={loading} />
      <MaterialHeader rulesStepsHeaders={Headers} loading={loading} />
      <MaterialImageLoader onImagesLoad={() => setImagesLoading(false)} />
      <MaterialGameSounds />
      <Menu />
      <FailuresDialog />
      <FullscreenDialog />
    </>
  )
}

const backgroundStyle = (backgroundImage?: string) => css`
  body {
    font-family: 'Oswald', 'Roboto Light', serif;
  }

  #root {
    ${backgroundImage && `background-image: url(${backgroundImage});`}
    background-size: cover;
    background-position: center;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 30, 0.7);
      pointer-events: none;
    }
  }
`
