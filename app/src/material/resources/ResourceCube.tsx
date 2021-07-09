/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import {Draggable} from '@gamepark/react-components'
import {DraggableProps} from '@gamepark/react-components/dist/Draggable/Draggable'
import {TFunction} from 'i18next'
import {useTranslation} from 'react-i18next'
import {screenRatio} from '../../util/Styles'
import DragItemType from '../DragItemType'
import Images from '../Images'

type Props = {
  resource: Resource
} & Omit<DraggableProps, 'type' | 'resource'>

export default function ResourceCube({resource, draggable = false, ...props}: Props) {
  const {t} = useTranslation()
  if (draggable) {
    return (
      <Draggable type={DragItemType.KRYSTALLIUM_FROM_EMPIRE} css={style} {...props}>
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