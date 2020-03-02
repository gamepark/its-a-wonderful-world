import {css, keyframes} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useGame} from 'tabletop-game-workshop'
import ItsAWonderfulWorld from '../../ItsAWonderfulWorld'
import Energy from '../resources/energy-cube.png'
import Exploration from '../resources/exploration-cube.png'
import Gold from '../resources/gold-cube.png'
import Krystallium from '../resources/krytallium-cube.png'
import Materials from '../resources/materials-cube.png'
import Resource from '../resources/Resource'
import Science from '../resources/science-cube.png'
import board from './board.png'
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
      {availableResources.map((resource, index) => <img key={index} src={resourceCube[resource]} css={getResourceStyle(index, resource)}/>)}
      {resources.map((resource) => <div key={resource} css={getResourceAreaHighlight(resource, availableResources.some(r => r == resource))}/>)}
    </div>
  )
}

const resources = Object.values(Resource)

const resourceCube = {
  [Resource.Materials]: Materials,
  [Resource.Energy]: Energy,
  [Resource.Science]: Science,
  [Resource.Gold]: Gold,
  [Resource.Exploration]: Exploration,
  [Resource.Krystallium]: Krystallium
}

const getResourceStyle = (index: number, resource: Resource) => css`
  position: absolute;
  width: 2%;
  left: ${resources.indexOf(resource) * 18.95 + 8.5 + cubesDispersion[index][0]}%;
  top: ${32 + cubesDispersion[index][1]}%;
  filter: drop-shadow(0 0 5px black);
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

const getResourceAreaHighlight = (resource:Resource, displayed: boolean) => css`
  position: absolute;
  width: 10%;
  height: 29%;
  left: ${resources.indexOf(resource) * 18.95 + 4.5}%;
  top: 22%;
  border-radius: 100%;
  display: ${displayed ? 'block' : 'none'};
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

const glow = (color: string) => keyframes`
  from {
    box-shadow: 0 0 5px ${color};
  }
  to {
    box-shadow: 0 0 30px ${color};
  }
`

export default Board