/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { DefaultHelpDisplay, MaterialHelpDisplayProps } from '@gamepark/react-game'
import { ConstructionButtons } from './ConstructionButtons'

export const DevelopmentCardHelpDisplay = (props: MaterialHelpDisplayProps) => {
  const isConstruction = props.item.location?.type === LocationType.ConstructionArea
  return (
    <div css={css`position: relative; flex-shrink: 0; ${isConstruction ? 'margin-left: 11em;' : ''}`}>
      <DefaultHelpDisplay {...props} />
      <ConstructionButtons {...props} />
    </div>
  )
}
