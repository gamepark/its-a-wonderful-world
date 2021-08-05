/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {EmotionJSX} from '@emotion/react/types/jsx-namespace'
import Resource, {resources} from '@gamepark/its-a-wonderful-world/material/Resource'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {getProductionAndCorruption} from '@gamepark/its-a-wonderful-world/Production'
import {FC, HTMLAttributes} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../material/Images'
import {getDescription} from '../material/resources/ResourceCube'

type Props = {
  player: Player | PlayerView
  small: boolean
}

// Display player's production the best way we can: each resource individually up to 11, then using multipliers for resources with the highest production
export default function PlayerResourceProduction({player, small}: Props) {
  const {t} = useTranslation()
  const production = resources.reduce((map, resource) => {
    map.set(resource, getProductionAndCorruption(player, resource))
    return map
  }, new Map<Resource, number>())
  let productionDisplay = new Map<Resource, ProductionDisplay>()
  let productionDisplaySize = 0
  for (const [resource, prod] of production.entries()) {
    productionDisplay.set(resource, {size: Math.abs(prod), corruption: prod < 0})
    productionDisplaySize += Math.abs(prod)
  }
  const displayMultiplierForHighProduction = (resource: Resource, production: number) => {
    const prodDisplay = productionDisplay.get(resource)
    if (prodDisplay?.size === production) {
      productionDisplay.set(resource, {...prodDisplay, size: 1, multiplier: prodDisplay.corruption ? -production : production})
      productionDisplaySize -= production - 1
    }
  }
  const reduceProductionDisplay = (maxSize: number) => {
    while (productionDisplaySize > maxSize) {
      const maxProduction = Math.max.apply(Math, Array.from<ProductionDisplay>(productionDisplay.values()).map(elements => elements.size))
      resources.forEach(resource => displayMultiplierForHighProduction(resource, maxProduction))
    }
  }
  reduceProductionDisplay(small ? 6 : 11)
  // Now, we set the start index for each display
  let resourceIndex = 0
  for (const resource of resources) {
    const display = productionDisplay.get(resource)!
    display.index = resourceIndex
    resourceIndex += display.size
  }

  return (
    <>
      {Array.from(productionDisplay.entries()).flatMap(([resource, productionDisplay]) => {
        const children: EmotionJSX.Element[] = []
        if (productionDisplay.multiplier) {
          children.push(<img key={resource + 'Multiplied'} src={resourceIcon[resource]} draggable="false" alt={getDescription(t, resource)}
                             css={productionStyle(productionDisplay.index!)}/>)
          if (productionDisplay.corruption) {
            children.push(<img key={resource + 'Corruption'} src={Images.corruption} draggable="false" alt={getDescription(t, resource)}
                               css={[productionStyle(productionDisplay.index!), corruptionStyle]}/>)
          }
          children.push(<ProductionMultiplier key={resource + 'Multiplier'} quantity={productionDisplay.multiplier}
                                              css={productionMultiplierStyle(productionDisplay.index!)}/>)
        } else {
          for (let index = 0; index < productionDisplay.size; index++) {
            children.push(<img key={resource + '_' + index} src={resourceIcon[resource]} draggable="false" alt={getDescription(t, resource)}
                               css={productionStyle(productionDisplay.index! + index)}/>)
            if (productionDisplay.corruption) {
              children.push(<img key={resource + 'Corruption_' + index} src={Images.corruption} draggable="false" alt={getDescription(t, resource)}
                                 css={[productionStyle(productionDisplay.index! + index), corruptionStyle]}/>)
            }
          }
        }
        return children
      })}
    </>
  )
}

type ProductionDisplay = {
  size: number
  corruption: boolean
  index?: number
  multiplier?: number
}

const resourceIcon = {
  [Resource.Materials]: Images.materials,
  [Resource.Energy]: Images.energy,
  [Resource.Science]: Images.science,
  [Resource.Gold]: Images.gold,
  [Resource.Exploration]: Images.exploration,
  [Resource.Krystallium]: Images.krystallium
}

const productionStyle = (index: number) => {
  if (index < 6) {
    return css`
      position: absolute;
      top: 5.5em;
      left: ${26 + index * 12}%;
      width: 11%;
      filter: drop-shadow(1px 1px 3px black);
    `
  } else {
    return css`
      position: absolute;
      top: 9em;
      left: ${32 + (index - 6) * 12}%;
      width: 11%;
      filter: drop-shadow(1px 1px 3px black);
    `
  }
}

const corruptionStyle = css`
  opacity: 0.8;
`

const ProductionMultiplier: FC<{ quantity: number } & HTMLAttributes<HTMLDivElement>> = ({quantity, ...props}) => (
  <div {...props} css={productionMultiplierQuantityStyle}>{quantity}</div>
)

const productionMultiplierStyle = (index: number) => {
  if (index < 6) {
    return css`
      position: absolute;
      text-align: center;
      top: 1.9em;
      left: ${26 + index * 12}%;
      width: 11%;
    `
  } else {
    return css`
      position: absolute;
      text-align: center;
      top: 3.05em;
      left: ${32 + (index - 6) * 12}%;
      width: 11%;
    `
  }
}

const productionMultiplierQuantityStyle = css`
  font-size: 3em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
`