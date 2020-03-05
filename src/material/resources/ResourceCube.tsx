import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Energy from './energy-cube.png'
import Exploration from './exploration-cube.png'
import Gold from './gold-cube.png'
import Krystallium from './krytallium-cube.png'
import Materials from './materials-cube.png'
import Resource from './Resource'
import Science from './science-cube.png'

type Props = { resource: Resource } & React.HTMLAttributes<HTMLImageElement>

const ResourceCube: FunctionComponent<Props> = ({resource, ...props}) => <img src={images[resource]} css={style} {...props}/>

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