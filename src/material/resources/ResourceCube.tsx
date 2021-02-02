import {css} from '@emotion/core'
import {Draggable} from '@gamepark/workshop'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {krystalliumFromEmpire} from '../../drag-objects/KrystalliumCube'
import {screenRatio} from '../../util/Styles'
import Images from '../Images'
import Resource from './Resource'

type Props = {
  resource: Resource
  draggable?: boolean
} & React.HTMLAttributes<HTMLElement>

const ResourceCube: FunctionComponent<Props> = ({resource, draggable = false, ...props}) => {
  const {t} = useTranslation()
  if (draggable) {
    return (
      <Draggable item={krystalliumFromEmpire} css={style} {...props}>
        <img src={images[resource]} css={css`width: 100%;`} draggable={false} alt={getDescription(t, resource)}/>
      </Draggable>
    )
  } else {
    return <img src={images[resource]} css={style} {...props} draggable={false} alt={getDescription(t, resource)}/>
  }
}

export const cubeWidth = 1.2
export const cubeHeight = 1.2 * screenRatio

const style = css`
  filter: drop-shadow(0 0 3px white);
`

export const getDescription = (t: TFunction, resource: Resource) => {
  switch (resource) {
    case Resource.Materials:
      return t('Materials')
    case Resource.Energy:
      return t('Energy')
    case Resource.Science:
      return t('Science')
    case Resource.Gold:
      return t('Gold')
    case Resource.Exploration:
      return t('Exploration')
    case Resource.Krystallium:
      return t('Krystallium')
  }
}

export const images = {
  [Resource.Materials]: Images.materialsCube,
  [Resource.Energy]: Images.energyCube,
  [Resource.Science]: Images.scienceCube,
  [Resource.Gold]: Images.goldCube,
  [Resource.Exploration]: Images.explorationCube,
  [Resource.Krystallium]: Images.krystalliumCube
}

export default ResourceCube