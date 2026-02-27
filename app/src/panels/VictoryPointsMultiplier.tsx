/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Character, isCharacter } from '@gamepark/its-a-wonderful-world/material/Character'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { ComboVictoryPoints } from '@gamepark/its-a-wonderful-world/Scoring'
import { TFunction } from 'i18next'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { characterIcons, developmentTypeIcons, scoreBackground, scoreIcon } from './Images'

type Props = {
  combo: ComboVictoryPoints
  quantity?: number
} & HTMLAttributes<HTMLDivElement>

export const VictoryPointsMultiplier = ({ combo, quantity, ...props }: Props) => {
  const { t } = useTranslation()
  const items = Array.isArray(combo.per) ? combo.per : [combo.per]
  return (
    <div {...props} css={[style, quantity === undefined && backgroundStyle]}>
      <span css={numberStyle}>{combo.quantity}</span>
      <span css={multiplierStyle}>x</span>
      {quantity !== undefined && <span css={quantityStyle}>{quantity}</span>}
      {items.map((item) =>
        isCharacter(item) ? (
          <img
            key={item}
            src={characterIcons[item as Character]}
            alt={getCharacterDescription(t, item as Character)}
            css={characterImageStyle}
          />
        ) : (
          <img
            key={item}
            src={developmentTypeIcons[item as DevelopmentType]}
            alt={getDevelopmentTypeDescription(t, item as DevelopmentType)}
            css={developmentTypeImageStyle}
          />
        )
      )}
    </div>
  )
}

const backgroundStyle = css`
  background-image: url(${scoreBackground});
  background-size: cover;
  border-radius: 0.8em;
  box-shadow: 0 0 0.2em black;
  padding: 0.2em;
`

const style = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const numberStyle = css`
  background-image: url(${scoreIcon});
  filter: drop-shadow(0 0 1px black);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
  font-size: 2.5em;
  flex-shrink: 0;
  width: 1em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black;
`

const multiplierStyle = css`
  z-index: 1;
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black;
  position: relative;
  transform: translateX(-0.3em);
  width: 0;
`

const developmentTypeImageStyle = css`
  box-shadow: 0 0 0.1em black;
  border-radius: 0.5em;
  width: 2.4em;
  height: 2.4em;
`

const characterImageStyle = css`
  box-shadow: 0 0 0.1em black;
  border-radius: 50%;
  width: 2.4em;
  height: 2.4em;
`

const quantityStyle = css`
  filter: drop-shadow(0 0 0.1em black);
  position: relative;
  width: 0;
  left: 0.4em;
  z-index: 1;
  text-align: center;
  font-size: 2.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.5em black;
`

const getCharacterDescription = (t: TFunction, character: Character) => {
  switch (character) {
    case Character.Financier:
      return t('Financier token')
    case Character.General:
      return t('General token')
  }
}

const getDevelopmentTypeDescription = (t: TFunction, developmentType: DevelopmentType) => {
  switch (developmentType) {
    case DevelopmentType.Structure:
      return t('Structure')
    case DevelopmentType.Vehicle:
      return t('Vehicle')
    case DevelopmentType.Research:
      return t('Research')
    case DevelopmentType.Project:
      return t('Project')
    case DevelopmentType.Discovery:
      return t('Discovery')
    case DevelopmentType.Memorial:
      return 'Memorial'
  }
}
