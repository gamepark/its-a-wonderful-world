/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {isCharacter} from '@gamepark/its-a-wonderful-world/material/Character'
import DevelopmentType from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import {ComboVictoryPoints} from '@gamepark/its-a-wonderful-world/Scoring'
import {TFunction} from 'i18next'
import {HTMLAttributes} from 'react'
import {useTranslation} from 'react-i18next'
import CharacterToken from '../material/characters/CharacterToken'
import Images from '../material/Images'

type Props = {
  combo: ComboVictoryPoints
  quantity?: number
} & HTMLAttributes<HTMLDivElement>

export default function VictoryPointsMultiplier({combo, quantity, ...props}: Props) {
  const {t} = useTranslation()
  const items = Array.isArray(combo.per) ? combo.per : [combo.per]
  return (
    <div {...props} css={[style, quantity === undefined ? backgroundStyle : '']}>
      <span css={numberStyle}>{combo.quantity}</span><span css={multiplierStyle}>x</span>
      {quantity !== undefined && <span css={quantityStyle}>{quantity}</span>}
      {items.map(item => isCharacter(item) ?
        <CharacterToken key={item} character={item} css={characterTokenImageStyle}/> :
        <img key={item} src={developmentTypeImage[item]} css={developmentTypeImageStyle} alt={getDevelopmentTypeDescription(t, item)}/>)}
    </div>
  )
}

const backgroundStyle = css`
  background-image: url(${Images.scoreBackground});
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

const developmentTypeImage = {
  [DevelopmentType.Structure]: Images.structureIcon,
  [DevelopmentType.Vehicle]: Images.vehicleIcon,
  [DevelopmentType.Research]: Images.researchIcon,
  [DevelopmentType.Project]: Images.projectIcon,
  [DevelopmentType.Discovery]: Images.discoveryIcon
}

const numberStyle = css`
  background-image: url(${Images.scoreIcon});
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

const characterTokenImageStyle = css`
  height: 80%;
`

const developmentTypeImageStyle = css`
  box-shadow: 0 0 0.1em black;
  height: 80%;
  border-radius: 0.5em;
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
  }
}