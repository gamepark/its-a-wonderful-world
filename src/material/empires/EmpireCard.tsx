import {css} from '@emotion/core'
import {usePlay, usePlayerId} from '@interlude-games/workshop'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import DragObjectType from '../../drag-objects/DragObjectType'
import ResourceFromBoard from '../../drag-objects/ResourceFromBoard'
import {placeResource} from '../../moves/PlaceResource'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {cardHeight, cardRatio, cardWidth, empireCardBottomMargin, empireCardLeftMargin, glow} from '../../util/Styles'
import Character from '../characters/Character'
import CharacterTokenPile from '../characters/CharacterTokenPile'
import Resource from '../resources/Resource'
import ResourceCube from '../resources/ResourceCube'
import AztecEmpireA from './aztec-empire-A.png'
import AztecEmpireAvatar from './aztec-empire-avatar.png'
import AztecEmpireB from './aztec-empire-B.png'
import EmpireName from './EmpireName'
import EmpireSide from './EmpireSide'
import FederationOfAsiaA from './federation-of-asia-A.png'
import FederationOfAsiaAvatar from './federation-of-asia-avatar.png'
import FederationOfAsiaB from './federation-of-asia-B.png'
import NoramStatesA from './noram-states-A.png'
import NoramStatesAvatar from './noram-states-avatar.png'
import NoramStatesB from './noram-states-B.png'
import PanafricanUnionA from './panafrican-union-A.png'
import PanafricanUnionAvatar from './panafrican-union-avatar.png'
import PanafricanUnionB from './panafrican-union-B.png'
import RepublicOfEuropeA from './republic-of-europe-A.png'
import RepublicOfEuropeAvatar from './republic-of-europe-avatar.png'
import RepublicOfEuropeB from './republic-of-europe-B.png'

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
      {player.empireCardResources.filter(resource => resource !== Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getResourceStyle(index)}/>)}
      {player.empireCardResources.filter(resource => resource === Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getKrystalliumStyle(index)} draggable={player.empire === playerId}/>)}
      <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} css={financiersPilePosition}
                          draggable={player.empire === playerId}/>
      <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} css={generalsPilePosition}
                          draggable={player.empire === playerId}/>
    </div>
  )
}

const style = css`
  position: absolute;
  left: ${empireCardLeftMargin}%;
  bottom: ${empireCardBottomMargin}%;
  height: ${cardHeight * cardRatio}%;
  width: ${cardWidth / cardRatio}%;
  transform-origin: bottom left;
  border-radius: 5%;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 2px black;
  background-size: cover;
`

const getBackgroundImage = (empire: EmpireName, empireSide: EmpireSide) => css`
  background-image: url(${empiresImages[empire][empireSide]});
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
  width: 10%;
  right: ${resourcePosition[index % 5][0]}%;
  top: ${resourcePosition[index % 5][1]}%;
`

const getKrystalliumStyle = (index: number) => css`
  position: absolute;
  width: 10%;
  right: -15%;
  bottom: ${index * 10}%;
`

export const resourcePosition = [
  [12, 32],
  [2, 47],
  [5, 66],
  [18, 66],
  [22, 47]
]

const financiersPilePosition = css`
  position: absolute;
  left: 40%;
  top: 30%;
  width: 20%;
`

const generalsPilePosition = css`
  position: absolute;
  left: 47%;
  top: 67%;
  width: 20%;
`

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