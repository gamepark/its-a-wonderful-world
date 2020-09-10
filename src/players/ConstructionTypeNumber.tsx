import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import DevelopmentType from '../material/developments/DevelopmentType'
import Images from '../material/Images'

type Props = {
  developmentType: DevelopmentType
  quantity: number
} & React.HTMLAttributes<HTMLDivElement>

const ConstructionTypeNumber: FunctionComponent<Props> = ({developmentType, quantity, ...props}) => {
  const {t} = useTranslation()
  return (
    <div {...props} >
      <img src={developmentTypeImage[developmentType]} css={developmentTypeImageStyle} alt={getDevelopmentTypeDescription(t, developmentType, quantity)}/>
      <div css={tokenQuantityStyle}>{quantity}</div>
    </div>
  )
}

const developmentTypeImageStyle = css`
  position: relative;
  width:100%;
  height:auto;
  box-shadow: 0 0 0.1em black;
  border-radius: 0.5em;
`

const tokenQuantityStyle = css`
  position: absolute;
  top: 40%;
  left: 60%;
  font-size: 2.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black,0 0 0.2em black,0 0 0.2em black;
`

const developmentTypeImage = {
  [DevelopmentType.Structure]: Images.structureIcon,
  [DevelopmentType.Vehicle]: Images.vehicleIcon,
  [DevelopmentType.Research]: Images.researchIcon,
  [DevelopmentType.Project]: Images.projectIcon,
  [DevelopmentType.Discovery]: Images.discoveryIcon
}

const getDevelopmentTypeDescription = (t: TFunction, developmentType: DevelopmentType, quantity: number) => {
  switch (developmentType) {
    case DevelopmentType.Structure:
      return t('{quantity, plural, one{1 construction grise} other{# constructions grises}} (Structures)', {quantity})
    case DevelopmentType.Vehicle:
      return t('{quantity, plural, one{1 construction noire} other{# constructions noires}} (Véhicules)', {quantity})
    case DevelopmentType.Research:
      return t('{quantity, plural, one{1 construction verte} other{# constructions vertes}}  (Recherches)', {quantity})
    case DevelopmentType.Project:
      return t('{quantity, plural, one{1 construction jaune} other{# constructions jaunes}} (Projets)', {quantity})
    case DevelopmentType.Discovery:
      return t('{quantity, plural, one{1 construction bleue} other{# constructions bleues}} (Découvertes)', {quantity})
  }
}

export default ConstructionTypeNumber