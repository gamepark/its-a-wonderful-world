import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character, {isCharacter} from '../material/characters/Character'
import CharacterToken from '../material/characters/CharacterToken'
import DevelopmentType from '../material/developments/DevelopmentType'
import Images from '../material/Images'

type Props = {
  item: DevelopmentType | Character
  multiplier: number
  quantity?: number
} & React.HTMLAttributes<HTMLDivElement>

const VictoryPointsMultiplier: FunctionComponent<Props> = ({item, multiplier, quantity, ...props}) => {
  const {t} = useTranslation()
  return (
    <div {...props} css={[style, quantity === undefined ? backgroundStyle : '']}>
      <span css={numberStyle}>{multiplier}</span><span css={multiplierStyle}>x</span>
      {quantity !== undefined && <span css={quantityStyle}>{quantity}</span>}
      {isCharacter(item) ?
        <CharacterToken character={item} css={characterTokenImageStyle}/> :
        <img src={developmentTypeImage[item]} css={developmentTypeImageStyle} alt={getDevelopmentTypeDescription(t, item, multiplier)}/>}
    </div>
  )
}

const backgroundStyle = css`
  background-image: url(${Images.scoreBackground});
  background-size: cover;
  border-radius: 0.8vh;
  box-shadow: 0 0 2px black;
  padding: 0.2vh;
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
  font-size: 2.5vh;
  flex-shrink: 0;
  width: 2.5vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
`

const multiplierStyle = css`
  z-index: 1;
  font-size: 1.5vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  position: relative;
  transform: translateX(-0.4vh);
  width: 0;
`

const characterTokenImageStyle = css`
  height: 80%;
`

const developmentTypeImageStyle = css`
  box-shadow: 0 0 1px black;
  height: 80%;
  border-radius: 0.5vh;
`

const quantityStyle = css`
  filter: drop-shadow(0 0 1px black);
  position: relative;
  width: 0;
  left: 1vh;
  z-index: 1;
  text-align: center;
  font-size: 2.5vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
`

const getDevelopmentTypeDescription = (t: TFunction, developmentType: DevelopmentType, quantity: number) => {
  switch (developmentType) {
    case DevelopmentType.Structure:
      return t('Ce joueur marque {quantity, plural, one{1 point} other{# points}} par développement blanc (les Structures)', {quantity})
    case DevelopmentType.Vehicle:
      return t('Ce joueur marque {quantity, plural, one{1 point} other{# points}} par développement noir (les Véhicules)', {quantity})
    case DevelopmentType.Research:
      return t('Ce joueur marque {quantity, plural, one{1 point} other{# points}} par développement vert (les Recherches)', {quantity})
    case DevelopmentType.Project:
      return t('Ce joueur marque {quantity, plural, one{1 point} other{# points}} par développement jaune (les Projets)', {quantity})
    case DevelopmentType.Discovery:
      return t('Ce joueur marque {quantity, plural, one{1 point} other{# points}} par développement bleu (les Découvertes)', {quantity})
  }
}

export default VictoryPointsMultiplier