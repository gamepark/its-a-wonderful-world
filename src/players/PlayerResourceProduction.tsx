import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {Fragment, FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {Player, PlayerView} from '../ItsAWonderfulWorld'
import {getEmpireName} from '../material/empires/EmpireCard'
import Energy from '../material/resources/energy.png'
import Exploration from '../material/resources/exploration.png'
import Gold from '../material/resources/gold.png'
import Krystallium from '../material/resources/krytallium.png'
import Materials from '../material/resources/materials.png'
import Resource from '../material/resources/Resource'
import Science from '../material/resources/science.png'
import {getProduction} from '../Rules'

const resources = Object.values(Resource)

// Display player's production the best way we can: each resource individually up to 11, then using multipliers for resources with the highest production
const PlayerResourceProduction: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => {
  const {t} = useTranslation()
  const production = resources.reduce((map, resource) => {
    map.set(resource, getProduction(player, resource))
    return map
  }, new Map<Resource, number>())
  let productionDisplay = new Map<Resource, ProductionDisplay>()
  let productionDisplaySize = 0
  for (const entry of production.entries()) {
    const size = entry[1]
    productionDisplay.set(entry[0], {size})
    productionDisplaySize += size
  }
  const displayMultiplierForHighProduction = (resource: Resource, production: number) => {
    if (productionDisplay.get(resource)?.size === production) {
      productionDisplay.set(resource, {size: 1, multiplier: production})
      productionDisplaySize -= production - 1
    }
  }
  const reduceProductionDisplay = (maxSize: number) => {
    while (productionDisplaySize > maxSize) {
      const maxProduction = Math.max.apply(Math, Array.from<ProductionDisplay>(productionDisplay.values()).map(elements => elements.size))
      resources.forEach(resource => displayMultiplierForHighProduction(resource, maxProduction))
    }
  }
  reduceProductionDisplay(11)
  // Now, we set the start index for each display
  let resourceIndex = 0
  for (const resource of resources) {
    const display = productionDisplay.get(resource)!
    display.index = resourceIndex
    resourceIndex += display.size
  }

  return (
    <Fragment>
      {Array.from(productionDisplay.entries()).flatMap(([resource, productionDisplay]) => {
        if (productionDisplay.multiplier) {
          return [
            <img key={resource + 'Multiplied'} src={resourceIcon[resource]} css={productionStyle(productionDisplay.index!)} draggable="false"
                 alt={getDescription(t, getEmpireName(t, player.empire), resource, production.get(resource)!)}/>,
            <ProductionMultiplier key={resource + 'Multiplier'} quantity={productionDisplay.multiplier}
                                  css={productionMultiplierStyle(productionDisplay.index!)}/>
          ]
        } else {
          return [...Array(productionDisplay.size).keys()].map((_, index) =>
            <img key={resource + index} src={resourceIcon[resource]} css={productionStyle(productionDisplay.index! + index)} draggable="false"
                 alt={getDescription(t, getEmpireName(t, player.empire), resource, production.get(resource)!)}/>)
        }
      })}
    </Fragment>
  )
}

type ProductionDisplay = {
  size: number
  index?: number
  multiplier?: number
}

const resourceIcon = {
  [Resource.Materials]: Materials,
  [Resource.Energy]: Energy,
  [Resource.Science]: Science,
  [Resource.Gold]: Gold,
  [Resource.Exploration]: Exploration,
  [Resource.Krystallium]: Krystallium
}

const productionStyle = (index: number) => {
  if (index < 6) {
    return css`
      position: absolute;
      top: 35%;
      left: ${22 + index * 12}%;
      width: 11%;
      filter: drop-shadow(1px 1px 3px black);
    `
  } else {
    return css`
      position: absolute;
      top: 58%;
      left: ${28 + (index - 6) * 12}%;
      width: 11%;
      filter: drop-shadow(1px 1px 3px black);
    `
  }
}

const ProductionMultiplier: FunctionComponent<{ quantity: number } & React.HTMLAttributes<HTMLDivElement>> = ({quantity, ...props}) => (
  <div {...props} css={productionMultiplierQuantityStyle}>{quantity}</div>
)

const productionMultiplierStyle = (index: number) => {
  if (index < 6) {
    return css`
      position: absolute;
      text-align: center;
      top: 37%;
      left: ${22 + index * 12}%;
      width: 11%;
    `
  } else {
    return css`
      position: absolute;
      text-align: center;
      top: 60%;
      left: ${28 + (index - 6) * 12}%;
      width: 11%;
    `
  }
}

const productionMultiplierQuantityStyle = css`
  font-size: 3vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black, 0 0 3px black, 0 0 3px black;
`

const getDescription = (t: TFunction, player: string, resource: Resource, quantity: number) => {
  switch (resource) {
    case Resource.Materials:
      return t('{player} produit {quantity, plural, one{# cube} other{# cubes}} gris (les Matériaux)', {player, quantity})
    case Resource.Energy:
      return t('{player} produit {quantity, plural, one{# cube noir} other{# cubes noirs}} (l’Énergie)', {player, quantity})
    case Resource.Science:
      return t('{player} produit {quantity, plural, one{# cube vert} other{# cubes verts}} (la Science)', {player, quantity})
    case Resource.Gold:
      return t('{player} produit {quantity, plural, one{# cube jaune} other{# cubes jaunes}} (l’Or)', {player, quantity})
    case Resource.Exploration:
      return t('{player} produit {quantity, plural, one{# cube bleu} other{# cubes bleus}} (l’Exploration)', {player, quantity})
    case Resource.Krystallium:
      return t('{player} produit {quantity, plural, one{# cube rouge} other{# cubes rouges}} (le Krystallium)', {player, quantity})
  }
}

export default PlayerResourceProduction