import {css} from '@emotion/core'
import {Draggable} from '@interlude-games/workshop'
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

const getDescription = (t: TFunction, resource: Resource) => {
  switch (resource) {
    case Resource.Materials:
      return t('Un cube gris représentant la ressource « Matériaux »')
    case Resource.Energy:
      return t('Un cube noir représentant la ressource « Énergie »')
    case Resource.Science:
      return t('Un cube vert représentant la ressource « Science »')
    case Resource.Gold:
      return t('Un cube jaune représentant la ressource « Or »')
    case Resource.Exploration:
      return t('Un cube bleu représentant la ressource « Exploration »')
    case Resource.Krystallium:
      return t('Un cube rouge représentant la ressource « Krystallium »')
  }
}

export const images = {
  [Resource.Materials]: Images.materialsCube,
  [Resource.Energy]: Images.energyCube,
  [Resource.Science]: Images.science,
  [Resource.Gold]: Images.goldCube,
  [Resource.Exploration]: Images.explorationCube,
  [Resource.Krystallium]: Images.krystalliumCube
}

export default ResourceCube