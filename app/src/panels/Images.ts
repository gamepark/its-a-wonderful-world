// Resource icons
import materials from '../images/resources/materials.png'
import energy from '../images/resources/energy.png'
import science from '../images/resources/science.png'
import gold from '../images/resources/gold.png'
import exploration from '../images/resources/exploration.png'
import krystallium from '../images/resources/krytallium.png'
import corruption from '../images/resources/corruption.png'

// Character tokens
import financier from '../images/characters/financier.jpg'
import general from '../images/characters/general.jpg'

// Development type icons
import structureIcon from '../images/developments/structure-icon.jpg'
import vehicleIcon from '../images/developments/vehicle-icon.jpg'
import researchIcon from '../images/developments/research-icon.jpg'
import projectIcon from '../images/developments/project-icon.jpg'
import discoveryIcon from '../images/developments/discovery-icon.jpg'

// Score images
import scoreBackground from '../images/score-background.png'
import scoreIcon from '../images/score-icon.png'
import arrowWhite from '../images/arrow-white.png'

// Empire avatars
import aztecEmpireAvatar from '../images/empires/aztec-empire-avatar.png'
import federationOfAsiaAvatar from '../images/empires/federation-of-asia-avatar.png'
import noramStatesAvatar from '../images/empires/noram-states-avatar.png'
import panafricanUnionAvatar from '../images/empires/panafrican-union-avatar.png'
import republicOfEuropeAvatar from '../images/empires/republic-of-europe-avatar.png'
import nationsOfOceaniaAvatar from '../images/empires/nations-of-oceania-avatar.png'
import northHegemonyAvatar from '../images/empires/north-hegemony-avatar.png'

// Empire artworks (backgrounds)
import aztecEmpireArtwork from '../images/empires/aztec-empire-artwork.jpg'
import federationOfAsiaArtwork from '../images/empires/federation-of-asia-artwork.jpg'
import noramStatesArtwork from '../images/empires/noram-states-artwork.jpg'
import panafricanUnionArtwork from '../images/empires/panafrican-union-artwork.jpg'
import republicOfEuropeArtwork from '../images/empires/republic-of-europe-artwork.jpg'
import nationsOfOceaniaArtwork from '../images/empires/nations-of-oceania-artwork.jpg'
import northHegemonyArtwork from '../images/empires/north-hegemony-artwork.jpg'

import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'

export const resourceIcons: Record<Resource, string> = {
  [Resource.Materials]: materials,
  [Resource.Energy]: energy,
  [Resource.Science]: science,
  [Resource.Gold]: gold,
  [Resource.Exploration]: exploration,
  [Resource.Krystallium]: krystallium
}

export const corruptionIcon = corruption

export const characterIcons: Record<Character, string> = {
  [Character.Financier]: financier,
  [Character.General]: general
}

export const empireAvatars: Record<Empire, string> = {
  [Empire.AztecEmpire]: aztecEmpireAvatar,
  [Empire.FederationOfAsia]: federationOfAsiaAvatar,
  [Empire.NoramStates]: noramStatesAvatar,
  [Empire.PanafricanUnion]: panafricanUnionAvatar,
  [Empire.RepublicOfEurope]: republicOfEuropeAvatar,
  [Empire.NationsOfOceania]: nationsOfOceaniaAvatar,
  [Empire.NorthHegemony]: northHegemonyAvatar
}

export const empireBackgrounds: Record<Empire, string> = {
  [Empire.AztecEmpire]: aztecEmpireArtwork,
  [Empire.FederationOfAsia]: federationOfAsiaArtwork,
  [Empire.NoramStates]: noramStatesArtwork,
  [Empire.PanafricanUnion]: panafricanUnionArtwork,
  [Empire.RepublicOfEurope]: republicOfEuropeArtwork,
  [Empire.NationsOfOceania]: nationsOfOceaniaArtwork,
  [Empire.NorthHegemony]: northHegemonyArtwork
}

export const developmentTypeIcons: Record<DevelopmentType, string> = {
  [DevelopmentType.Structure]: structureIcon,
  [DevelopmentType.Vehicle]: vehicleIcon,
  [DevelopmentType.Research]: researchIcon,
  [DevelopmentType.Project]: projectIcon,
  [DevelopmentType.Discovery]: discoveryIcon,
  [DevelopmentType.Memorial]: ''
}

export { scoreBackground, scoreIcon, arrowWhite }
