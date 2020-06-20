import {css} from '@emotion/core'
import {usePlay, usePlayerId} from '@interlude-games/workshop'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DragObjectType from '../../drag-objects/DragObjectType'
import ResourceFromBoard from '../../drag-objects/ResourceFromBoard'
import {placeResource} from '../../moves/PlaceResource'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {empireCardBottomMargin, empireCardHeight, empireCardLeftMargin, empireCardWidth, glow} from '../../util/Styles'
import Resource from '../resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth} from '../resources/ResourceCube'
import AztecEmpireA from './aztec-empire-A.jpg'
import AztecEmpireAvatar from './aztec-empire-avatar.png'
import AztecEmpireB from './aztec-empire-B.jpg'
import EmpireName from './EmpireName'
import EmpireSide from './EmpireSide'
import FederationOfAsiaA from './federation-of-asia-A.jpg'
import FederationOfAsiaAvatar from './federation-of-asia-avatar.png'
import FederationOfAsiaB from './federation-of-asia-B.jpg'
import NoramStatesA from './noram-states-A.jpg'
import NoramStatesAvatar from './noram-states-avatar.png'
import NoramStatesB from './noram-states-B.jpg'
import PanafricanUnionA from './panafrican-union-A.jpg'
import PanafricanUnionAvatar from './panafrican-union-avatar.png'
import PanafricanUnionB from './panafrican-union-B.jpg'
import RepublicOfEuropeA from './republic-of-europe-A.jpg'
import RepublicOfEuropeAvatar from './republic-of-europe-avatar.png'
import RepublicOfEuropeB from './republic-of-europe-B.jpg'

const empiresImages = {
  [EmpireName.AztecEmpire]: {
    [EmpireSide.A]: AztecEmpireA,
    [EmpireSide.B]: AztecEmpireB
  },
  [EmpireName.FederationOfAsia]: {
    [EmpireSide.A]: FederationOfAsiaA,
    [EmpireSide.B]: FederationOfAsiaB
  },
  [EmpireName.NoramStates]: {
    [EmpireSide.A]: NoramStatesA,
    [EmpireSide.B]: NoramStatesB
  },
  [EmpireName.PanafricanUnion]: {
    [EmpireSide.A]: PanafricanUnionA,
    [EmpireSide.B]: PanafricanUnionB
  },
  [EmpireName.RepublicOfEurope]: {
    [EmpireSide.A]: RepublicOfEuropeA,
    [EmpireSide.B]: RepublicOfEuropeB
  }
}

export const empireAvatar = {
  [EmpireName.AztecEmpire]: AztecEmpireAvatar,
  [EmpireName.FederationOfAsia]: FederationOfAsiaAvatar,
  [EmpireName.NoramStates]: NoramStatesAvatar,
  [EmpireName.PanafricanUnion]: PanafricanUnionAvatar,
  [EmpireName.RepublicOfEurope]: RepublicOfEuropeAvatar
}

type Props = {
  player: Player | PlayerView
  withResourceDrop?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const EmpireCard: FunctionComponent<Props> = ({player, withResourceDrop = false, ...props}) => {
  const {t} = useTranslation()
  const play = usePlay()
  const playerId = usePlayerId<EmpireName>()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.RESOURCE_FROM_BOARD,
    canDrop: () => withResourceDrop,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragObjectType.RESOURCE_FROM_BOARD,
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard) => play(placeResource(player.empire, item.resource))
  })
  return (
    <div ref={ref} {...props} css={[style, getBackgroundImage(player.empire, player.empireSide), isValidTarget && validTargetStyle, isOver && overStyle]}>
      <div css={empireCardTitle}>({player.empireSide}) {getEmpireName(t, player.empire)}</div>
      {player.empireCardResources.filter(resource => resource !== Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getResourceStyle(index)}/>)}
      {player.empireCardResources.filter(resource => resource === Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getKrystalliumStyle(index)} draggable={player.empire === playerId}/>)}
    </div>
  )
}

const style = css`
  position: absolute;
  left: ${empireCardLeftMargin}%;
  bottom: ${empireCardBottomMargin}%;
  height: ${empireCardHeight}%;
  width: ${empireCardWidth}%;
  transform-origin: bottom left;
  border-radius: 5%;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 5px black;
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
  text-align:center;
  font-size: 1vh;
  font-weight: lighter;
  text-shadow: 0 0 0.3vh #000, 0 0 0.3vh #000;
  text-transform:uppercase;
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
  right: ${- cubeWidth * 1.2 * 100 / empireCardWidth}%;
  bottom: ${index * cubeHeight * 0.8 * 100 / empireCardHeight}%;
`

export const resourcePosition = [
  [29, 60],
  [15, 60],
  [10, 45],
  [22, 36],
  [34, 45]
]

export function getEmpireName(t: TFunction, empire: EmpireName) {
  switch (empire) {
    case EmpireName.AztecEmpire:
      return t('Empire d’Azteca')
    case EmpireName.FederationOfAsia:
      return t('Fédération d’Asie')
    case EmpireName.NoramStates:
      return t('États du Noram')
    case EmpireName.PanafricanUnion:
      return t('Union Panafricaine')
    case EmpireName.RepublicOfEurope:
      return t('République d’Europa')
  }
}

export default EmpireCard