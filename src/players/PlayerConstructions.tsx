import React, {FunctionComponent} from 'react'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import Character from '../material/characters/Character'
import CharacterTokenPile from '../material/characters/CharacterTokenPile'
import {isPlayer} from '../types/typeguards'
import {css} from '@emotion/core'
// import ScorePart from './score/ScorePart'
// import {characterTypes} from '../material/characters/Character'

// Display player's tokens and constructions
const PlayerConstructions: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => {
  // const {t} = useTranslation()
  const gameOver = false
  return (
    <>
      <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} player={player} gameOver={gameOver}
                          css={financiersPilePosition} draggable={isPlayer(player)}/>
      <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} player={player} gameOver={gameOver}
                          css={generalsPilePosition} draggable={isPlayer(player)}/>
      {/*characterTypes.map(character => <TokenDisplay key={character} player={player} item={character}/>*!/*/}
      {/*{Array.from(productionDisplay.entries()).flatMap(([resource, productionDisplay]) => {*/}
      {/*  if (productionDisplay.multiplier) {*/}
      {/*    return [*/}
      {/*      <img key={resource + 'Multiplied'} src={resourceIcon[resource]} css={productionStyle(productionDisplay.index!)} draggable="false"*/}
      {/*           alt={getDescription(t, getEmpireName(t, player.empire), resource, production.get(resource)!)}/>,*/}
      {/*      <ProductionMultiplier key={resource + 'Multiplier'} quantity={productionDisplay.multiplier}*/}
      {/*                            css={productionMultiplierStyle(productionDisplay.index!)}/>*/}
      {/*    ]*/}
      {/*  } else {*/}
      {/*    return [...Array(productionDisplay.size).keys()].map((_, index) =>*/}
      {/*      <img key={resource + index} src={resourceIcon[resource]} css={productionStyle(productionDisplay.index! + index)} draggable="false"*/}
      {/*           alt={getDescription(t, getEmpireName(t, player.empire), resource, production.get(resource)!)}/>)*/}
      {/*  }*/}
      {/*})}*/}
    </>
  )
}

const financiersPilePosition = css`
  position: absolute;
  left: 23%;
  top: 65%;
  width: 10%;
  height: 10%;
`

const generalsPilePosition = css`
  position: absolute;
  left: 35%;
  top: 65%;
  width: 10%;
  height: 10%;
`

// type ConstructionDisplay = {
//   size: number
//   index?: number
// }

// const resourceIcon = {
//   [Resource.Materials]: Images.materials,
//   [Resource.Energy]: Images.energy,
//   [Resource.Science]: Images.science,
//   [Resource.Gold]: Images.gold,
//   [Resource.Exploration]: Images.exploration,
//   [Resource.Krystallium]: Images.krystallium
// }
//
// const productionMultiplierStyle = (index: number) => {
//   if (index < 6) {
//     return css`
//       position: absolute;
//       text-align: center;
//       top: 37%;
//       left: ${22 + index * 12}%;
//       width: 11%;
//     `
//   } else {
//     return css`
//       position: absolute;
//       text-align: center;
//       top: 60%;
//       left: ${28 + (index - 6) * 12}%;
//       width: 11%;
//     `
//   }
// }
//
// const productionMultiplierQuantityStyle = css`
//   font-size: 3em;
//   font-weight: bold;
//   color: white;
//   text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
// `
//
// const getDescription = (t: TFunction, player: string, resource: Resource, quantity: number) => {
//   switch (resource) {
//     case Resource.Materials:
//       return t('{player} a construit {quantity, plural, one{# cube} other{# bâtiments}} gris (les Usines)', {player, quantity})
//     case Resource.Energy:
//       return t('{player} a construit {quantity, plural, one{# cube noir} other{# cubes noirs}} (les Véhicules)', {player, quantity})
//     case Resource.Science:
//       return t('{player} a construit {quantity, plural, one{# cube vert} other{# cubes verts}} (les Recherches)', {player, quantity})
//     case Resource.Gold:
//       return t('{player} a construit {quantity, plural, one{# cube jaune} other{# cubes jaunes}} (les Industries)', {player, quantity})
//     case Resource.Exploration:
//       return t('{player} a construit {quantity, plural, one{# cube bleu} other{# cubes bleus}} (les Découvertes)', {player, quantity})
//
//   }
// }

export default PlayerConstructions