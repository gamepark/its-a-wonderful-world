import {css, keyframes} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {DragPreviewImage, useDrag} from 'react-dnd'
import {resourceFromBoard} from '../../drag-objects/ResourceFromBoard'
import Resource from '../resources/Resource'
import ResourceCube, {images as resourceCubeImages} from '../resources/ResourceCube'

const ResourceArea: FunctionComponent<{ resource: Resource, canDrag: boolean, quantity: number }> = ({resource, canDrag, quantity}) => {
  const [, ref, preview] = useDrag({
    canDrag, item: resourceFromBoard(resource),
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  return (
    <>
      <DragPreviewImage connect={preview} src={resourceCubeImages[resource]}/>
      {[...Array(quantity)].map((_, index) => <ResourceCube key={index} resource={resource} css={getResourceStyle(index, resource)}/>)}
      <div ref={ref} key={resource} css={[getResourceAreaHighlight(resource), canDrag && canDragStyle]}/>
    </>
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
  animation: ${glow(resourceColor[resource])} 1s ease-in-out infinite alternate;
`

const canDragStyle = css`
  cursor: grab;
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

const getResourceStyle = (index: number, resource: Resource) => {
  const cubeDispersion = cubesDispersion[index] || [0, 0]
  return css`
    position: absolute;
    width: 2%;
    left: ${resources.indexOf(resource) * 18.95 + 8.5 + cubeDispersion[0]}%;
    top: ${32 + cubeDispersion[1]}%;
  `
}

const cubesDispersion = [
  [-2.5, -4],
  [1.5, -3],
  [2.5, 4],
  [-3, 3.5],
  [0.5, 9],
  [-0.5, 1.5],
  [0, -9],
  [-2, 10],
  [4, -2],
  [3, 10]
]

export default ResourceArea