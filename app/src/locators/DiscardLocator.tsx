/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { DeckLocator, DropAreaDescription, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

// Scale from v2 (DrawPile.tsx: drawPileScale = 0.4)
const drawPileScale = 0.4

// Same dimensions as construction area
const cardWidth = 6.5
const areasCardMargin = 1
const areaPadding = 0.7
const maxConstructionCards = 7
const areaWidth = (cardWidth + areasCardMargin) * maxConstructionCards - areasCardMargin + areaPadding * 2

class DiscardLocator extends DeckLocator<Empire, MaterialType, LocationType> {
  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const hasAscension = context.rules.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).length > 0
    return { x: hasAscension ? -16.5 : -20, y: -15.5, z: 0 }
  }

  // Half of default gap ({ x: -0.05, y: -0.05 })
  gap = { x: -0.025, y: -0.025 }

  placeItem(item: MaterialItem<Empire, LocationType>, context: ItemContext<Empire, MaterialType, LocationType>): string[] {
    return [...super.placeItem(item, context), `scale(${drawPileScale})`]
  }

  // Large drop area covering upper half of screen
  locationDescription = new DiscardDropAreaDescription()

  getAreaCoordinates() {
    return { x: 0.5, y: -10.5, z: 2 }
  }
}

const DiscardContent = () => {
  const { t } = useTranslation()
  return <span css={textStyle}>&rarr; {t('Recycle')}</span>
}

const textStyle = css`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: antiquewhite;
  font-size: 6em;
  text-shadow: 0 0 0.15em black, 0 0 0.3em black, 0 0 0.6em black;
`

class DiscardDropAreaDescription extends DropAreaDescription<Empire, MaterialType, LocationType> {
  // Same width as construction area
  width = areaWidth
  // Height covers upper half of table (from yMin=-18.5 to around y=0)
  height = 15
  borderRadius = 1
  content = DiscardContent
}

export const discardLocator = new DiscardLocator()
