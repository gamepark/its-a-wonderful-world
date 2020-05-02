import {css} from '@emotion/core'
import {Draggable} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {krystalliumFromEmpire} from '../../drag-objects/KrystalliumCube'
import Energy from './energy-cube.png'
import Exploration from './exploration-cube.png'
import Gold from './gold-cube.png'
import Krystallium from './krytallium-cube.png'
import Materials from './materials-cube.png'
import Resource from './Resource'
import Science from './science-cube.png'

type Props = {
  resource: Resource
  draggable?: boolean
} & React.HTMLAttributes<HTMLElement>

const ResourceCube: FunctionComponent<Props> = ({resource, draggable = false, ...props}) => {
  if (draggable) {
    return (
      <Draggable item={krystalliumFromEmpire} css={style} {...props}>
        <img src={images[resource]} css={css`width: 100%;`}/>
      </Draggable>
    )
  } else {
    return <img src={images[resource]} css={style} {...props} draggable={false}/>
  }
}

const style = css`
  filter: drop-shadow(0 0 5px black);
`

export const images = {
  [Resource.Materials]: Materials,
  [Resource.Energy]: Energy,
  [Resource.Science]: Science,
  [Resource.Gold]: Gold,
  [Resource.Exploration]: Exploration,
  [Resource.Krystallium]: Krystallium
}

export default ResourceCube