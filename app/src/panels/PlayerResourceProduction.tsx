/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Resource, resources } from '@gamepark/its-a-wonderful-world/material/Resource'
import { FC, HTMLAttributes, ReactElement } from 'react'
import { corruptionIcon, resourceIcons } from './Images'
import { usePlayerProduction } from './usePlayerData'

type Props = {
  playerId: Empire
  small?: boolean
}

type ProductionDisplay = {
  size: number
  corruption: boolean
  index?: number
  multiplier?: number
}

/**
 * Display player's production - each resource individually up to 11,
 * then using multipliers for resources with the highest production
 */
export const PlayerResourceProduction: FC<Props> = ({ playerId, small = false }) => {
  const production = usePlayerProduction(playerId)

  // Build display data
  let productionDisplay = new Map<Resource, ProductionDisplay>()
  let productionDisplaySize = 0

  for (const resource of resources) {
    if (resource === Resource.Krystallium) continue
    const prod = production.get(resource) ?? 0
    productionDisplay.set(resource, { size: Math.abs(prod), corruption: prod < 0 })
    productionDisplaySize += Math.abs(prod)
  }

  const displayMultiplierForHighProduction = (resource: Resource, productionValue: number) => {
    const prodDisplay = productionDisplay.get(resource)
    if (prodDisplay?.size === productionValue) {
      productionDisplay.set(resource, {
        ...prodDisplay,
        size: 1,
        multiplier: prodDisplay.corruption ? -productionValue : productionValue
      })
      productionDisplaySize -= productionValue - 1
    }
  }

  const reduceProductionDisplay = (maxSize: number) => {
    while (productionDisplaySize > maxSize) {
      const maxProduction = Math.max(
        ...Array.from(productionDisplay.values()).map(d => d.size)
      )
      for (const resource of resources) {
        if (resource !== Resource.Krystallium) {
          displayMultiplierForHighProduction(resource, maxProduction)
        }
      }
    }
  }

  reduceProductionDisplay(small ? 6 : 11)

  // Set start index for each display
  let resourceIndex = 0
  for (const resource of resources) {
    if (resource === Resource.Krystallium) continue
    const display = productionDisplay.get(resource)!
    display.index = resourceIndex
    resourceIndex += display.size
  }

  const elements: ReactElement[] = []

  for (const resource of resources) {
    if (resource === Resource.Krystallium) continue
    const display = productionDisplay.get(resource)!

    if (display.multiplier) {
      elements.push(
        <img
          key={resource + 'Multiplied'}
          src={resourceIcons[resource]}
          draggable="false"
          alt=""
          css={productionStyle(display.index!)}
        />
      )
      if (display.corruption) {
        elements.push(
          <img
            key={resource + 'Corruption'}
            src={corruptionIcon}
            draggable="false"
            alt=""
            css={[productionStyle(display.index!), corruptionStyle]}
          />
        )
      }
      elements.push(
        <ProductionMultiplier
          key={resource + 'Multiplier'}
          quantity={display.multiplier}
          css={productionMultiplierStyle(display.index!)}
        />
      )
    } else {
      for (let i = 0; i < display.size; i++) {
        elements.push(
          <img
            key={resource + '_' + i}
            src={resourceIcons[resource]}
            draggable="false"
            alt=""
            css={productionStyle(display.index! + i)}
          />
        )
        if (display.corruption) {
          elements.push(
            <img
              key={resource + 'Corruption_' + i}
              src={corruptionIcon}
              draggable="false"
              alt=""
              css={[productionStyle(display.index! + i), corruptionStyle]}
            />
          )
        }
      }
    }
  }

  return <>{elements}</>
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

const ProductionMultiplier: FC<{ quantity: number } & HTMLAttributes<HTMLDivElement>> = ({
  quantity,
  ...props
}) => <div {...props}>{quantity}</div>

const productionMultiplierStyle = (index: number) => {
  const base = css`
    font-size: 3em;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
    text-align: center;
    width: 11%;
  `

  if (index < 6) {
    return [
      base,
      css`
        position: absolute;
        top: 1.9em;
        left: ${26 + index * 12}%;
      `
    ]
  } else {
    return [
      base,
      css`
        position: absolute;
        top: 3.05em;
        left: ${32 + (index - 6) * 12}%;
      `
    ]
  }
}
