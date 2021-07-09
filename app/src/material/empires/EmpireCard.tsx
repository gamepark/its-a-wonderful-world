/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import EmpireSide from '@gamepark/its-a-wonderful-world/material/EmpireSide'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import {placeResourceOnEmpireMove} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {usePlay, usePlayerId} from '@gamepark/react-client'
import {HTMLAttributes} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {empireCardHeight, empireCardWidth, glow} from '../../util/Styles'
import DragItemType from '../DragItemType'
import Images from '../Images'
import ResourceCube, {cubeHeight, cubeWidth} from '../resources/ResourceCube'

type Props = {
  player: Player | PlayerView
  gameOver?: boolean
  withResourceDrop?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function EmpireCard({player, gameOver = false, withResourceDrop = false, ...props}: Props) {
  const {t} = useTranslation()
  const play = usePlay()
  const playerId = usePlayerId<EmpireName>()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragItemType.RESOURCE_FROM_BOARD,
    canDrop: () => withResourceDrop,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragItemType.RESOURCE_FROM_BOARD,
      isOver: monitor.isOver()
    }),
    drop: ({resource}: { resource: Resource }) => play(placeResourceOnEmpireMove(player.empire, resource))
  })
  return (
    <div ref={ref} {...props} css={[style, getBackgroundImage(player.empire, player.empireSide), isValidTarget && validTargetStyle, isOver && overStyle]}>
      <div css={empireCardTitle}>({String.fromCharCode(64 + player.empireSide)}) {getPlayerName(player.empire, t)}</div>
      {player.empireCardResources.filter(resource => resource !== Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getResourceStyle(index)}/>)}
      {player.empireCardResources.filter(resource => resource === Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getKrystalliumStyle(index)} draggable={!gameOver && player.empire === playerId}/>)}
    </div>
  )
}

const empiresImages: {[key in EmpireName]: {[key in EmpireSide]: string}} = {
  [EmpireName.AztecEmpire]: {
    [EmpireSide.A]: Images.aztecEmpireA,
    [EmpireSide.B]: Images.aztecEmpireB,
    [EmpireSide.C]: Images.aztecEmpireC,
    [EmpireSide.D]: Images.aztecEmpireD,
    [EmpireSide.E]: Images.aztecEmpireE,
    [EmpireSide.F]: Images.aztecEmpireF
  },
  [EmpireName.FederationOfAsia]: {
    [EmpireSide.A]: Images.federationOfAsiaA,
    [EmpireSide.B]: Images.federationOfAsiaB,
    [EmpireSide.C]: Images.federationOfAsiaC,
    [EmpireSide.D]: Images.federationOfAsiaD,
    [EmpireSide.E]: Images.federationOfAsiaE,
    [EmpireSide.F]: Images.federationOfAsiaF
  },
  [EmpireName.NoramStates]: {
    [EmpireSide.A]: Images.noramStatesA,
    [EmpireSide.B]: Images.noramStatesB,
    [EmpireSide.C]: Images.noramStatesC,
    [EmpireSide.D]: Images.noramStatesD,
    [EmpireSide.E]: Images.noramStatesE,
    [EmpireSide.F]: Images.noramStatesF
  },
  [EmpireName.PanafricanUnion]: {
    [EmpireSide.A]: Images.panafricanUnionA,
    [EmpireSide.B]: Images.panafricanUnionB,
    [EmpireSide.C]: Images.panafricanUnionC,
    [EmpireSide.D]: Images.panafricanUnionD,
    [EmpireSide.E]: Images.panafricanUnionE,
    [EmpireSide.F]: Images.panafricanUnionF
  },
  [EmpireName.RepublicOfEurope]: {
    [EmpireSide.A]: Images.republicOfEuropeA,
    [EmpireSide.B]: Images.republicOfEuropeB,
    [EmpireSide.C]: Images.republicOfEuropeC,
    [EmpireSide.D]: Images.republicOfEuropeD,
    [EmpireSide.E]: Images.republicOfEuropeE,
    [EmpireSide.F]: Images.republicOfEuropeF
  },
  [EmpireName.NationsOfOceania]: {
    [EmpireSide.A]: Images.nationsOfOceaniaA,
    [EmpireSide.B]: Images.nationsOfOceaniaB,
    [EmpireSide.C]: Images.nationsOfOceaniaC,
    [EmpireSide.D]: Images.nationsOfOceaniaD,
    [EmpireSide.E]: Images.nationsOfOceaniaE,
    [EmpireSide.F]: Images.nationsOfOceaniaF
  },
  [EmpireName.NorthHegemony]: {
    [EmpireSide.A]: Images.northHegemonyA,
    [EmpireSide.B]: Images.northHegemonyB,
    [EmpireSide.C]: Images.northHegemonyC,
    [EmpireSide.D]: Images.northHegemonyD,
    [EmpireSide.E]: Images.northHegemonyE,
    [EmpireSide.F]: Images.northHegemonyF
  }
}

export const empireAvatar: {[key in EmpireName]: string} = {
  [EmpireName.AztecEmpire]: Images.aztecEmpireAvatar,
  [EmpireName.FederationOfAsia]: Images.federationOfAsiaAvatar,
  [EmpireName.NoramStates]: Images.noramStatesAvatar,
  [EmpireName.PanafricanUnion]: Images.panafricanUnionAvatar,
  [EmpireName.RepublicOfEurope]: Images.republicOfEuropeAvatar,
  [EmpireName.NationsOfOceania]: Images.nationsOfOceaniaAvatar,
  [EmpireName.NorthHegemony]: Images.northHegemonyAvatar
}

const style = css`
  transform-origin: bottom left;
  border-radius: 5%;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 0.5em black;
  background-size: cover;
`

const getBackgroundImage = (empire: EmpireName, empireSide: EmpireSide) => css`
  background-image: url(${empiresImages[empire][empireSide]});
`

export const empireCardTitle = css`
  position: absolute;
  bottom: 11%;
  left: 6%;
  width: 80%;
  color: #EEE;
  text-align: center;
  font-size: 1em;
  font-weight: lighter;
  text-shadow: 0 0 0.3em #000, 0 0 0.3em #000;
  text-transform: uppercase;
`

const validTargetStyle = css`
  z-index: 1;
  animation: ${glow('green')} 1s ease-in-out infinite alternate;
  transform: scale(1.1);
`

const overStyle = css`
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 128, 0, 0.3);
  }
`

const getResourceStyle = (index: number) => css`
  position: absolute;
  width: ${cubeWidth * 100 / empireCardWidth}%;
  height: ${cubeHeight * 100 / empireCardHeight}%;
  left: ${resourcePosition[index % 5][0]}%;
  top: ${resourcePosition[index % 5][1]}%;
`

const getKrystalliumStyle = (index: number) => css`
  position: absolute;
  width: ${cubeWidth * 100 / empireCardWidth}%;
  height: ${cubeHeight * 100 / empireCardHeight}%;
  right: ${-cubeWidth * 1.2 * 100 / empireCardWidth}%;
  bottom: ${index * cubeHeight * 0.8 * 100 / empireCardHeight}%;
`

export const resourcePosition = [
  [29, 60],
  [15, 60],
  [10, 45],
  [22, 36],
  [34, 45]
]