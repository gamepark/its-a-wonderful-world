import {css, keyframes} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {DragPreviewImage} from 'react-dnd'
import {useDrag} from 'tabletop-game-workshop'
import {resourceFromBoard} from '../../drag-objects/ResourceFromBoard'
import Resource from '../resources/Resource'
import {resourceCube} from './Board'

const ResourceArea: FunctionComponent<{ resource: Resource }> = ({resource}) => {
  const [{}, ref, preview] = useDrag({
    item: resourceFromBoard(resource),
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  return (
    <Fragment>
      <DragPreviewImage connect={preview} src={resourceCube[resource]}/>
      <div ref={ref} key={resource} css={getResourceAreaHighlight(resource)}/>
    </Fragment>
  )
}

const resources = Object.values(Resource)

const getResourceAreaHighlight = (resource: Resource) => css`
  position: absolute;
  width: 10%;
  height: 29%;
  left: ${resources.indexOf(resource) * 18.95 + 4.5}%;
  top: 22%;
  border-radius: 100%;
  cursor: grab;
  animation: ${glow(resourceColor[resource])} 1s ease-in-out infinite alternate;
`

const resourceColor = {
  [Resource.Materials]: 'white',
  [Resource.Energy]: 'black',
  [Resource.Science]: 'green',
  [Resource.Gold]: 'gold',
  [Resource.Exploration]: 'blue',
  [Resource.Krystallium]: 'red'
}

export const glow = (color: string) => keyframes`
  from {
    box-shadow: 0 0 5px ${color};
  }
  to {
    box-shadow: 0 0 30px ${color};
  }
`

export default ResourceArea