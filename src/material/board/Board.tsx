import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useGame} from 'tabletop-game-workshop'
import ItsAWonderfulWorld from '../../ItsAWonderfulWorld'
import Resource from '../resources/Resource'
import ResourceCube from '../resources/ResourceCube'
import board from './board.png'
import ResourceArea from './ResourceArea'
import roundTracker1 from './round-tracker-1-3.png'
import roundTracker2 from './round-tracker-2-4.png'

type Props = {
  availableResources: Resource[]
}

const Board: FunctionComponent<Props> = ({availableResources}) => {
  const game = useGame<ItsAWonderfulWorld>()
  return (
    <div css={css`
       position: absolute;
       height: 34%;
       top: 9%;
       left: 50%;
       transform: translateX(-50%);
      `}>
      <img src={board} css={css`height: 100%; filter: drop-shadow(0.1vh 0.1vh 0.5vh black);`} draggable="false"/>
      <img alt={'Round tracker'} src={game.round % 2 ? roundTracker1 : roundTracker2} draggable="false" css={css`
        position: absolute;
        height: 10%;
        top: 4.1%;
        left: ${game.round == 1 ? 36.65 : game.round == 2 ? 40.6 : game.round == 3 ? 50.4 : 54.35}%;
      `}/>
      {availableResources.map((resource, index) => <ResourceCube key={index} resource={resource} css={getResourceStyle(index, resource)}/>)}
      {resources.filter(resource => availableResources.indexOf(resource) != -1).map((resource) => <ResourceArea key={resource} resource={resource}/>)}
    </div>
  )
}

const resources = Object.values(Resource)

const getResourceStyle = (index: number, resource: Resource) => css`
  position: absolute;
  width: 2%;
  left: ${resources.indexOf(resource) * 18.95 + 8.5 + cubesDispersion[index][0]}%;
  top: ${32 + cubesDispersion[index][1]}%;
`

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

export default Board