import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useDrop, usePlay} from 'tabletop-game-workshop'
import DragObjectType from '../../drag-objects/DragObjectType'
import ResourceFromBoard from '../../drag-objects/ResourceFromBoard'
import {Player} from '../../ItsAWonderfulWorld'
import {placeResource} from '../../moves/PlaceResource'
import {glow} from '../board/ResourceArea'
import Character from '../characters/Character'
import CharacterTokenPile from '../characters/CharacterTokenPile'
import ResourceCube from '../resources/ResourceCube'
import AztecEmpireA from './aztec-empire-A.png'
import AztecEmpireAvatar from './aztec-empire-avatar.png'
import AztecEmpireBackground from './aztec-empire-background.png'
import Empire from './Empire'
import FederationOfAsiaA from './federation-of-asia-A.png'
import FederationOfAsiaAvatar from './federation-of-asia-avatar.png'
import FederationOfAsiaBackground from './federation-of-asia-background.png'
import NoramStatesA from './noram-states-A.png'
import NoramStatesAvatar from './noram-states-avatar.png'
import NoramStatesBackground from './noram-states-background.png'
import PanafricanUnionA from './panafrican-union-A.png'
import PanafricanUnionAvatar from './panafrican-union-avatar.png'
import PanafricanUnionBackground from './panafrican-union-background.png'
import RepublicOfEuropeA from './republic-of-europe-A.png'
import RepublicOfEuropeAvatar from './republic-of-europe-avatar.png'
import RepublicOfEuropeBackground from './republic-of-europe-background.png'

const empireFaceA = {
  [Empire.AztecEmpire]: AztecEmpireA,
  [Empire.FederationOfAsia]: FederationOfAsiaA,
  [Empire.NoramStates]: NoramStatesA,
  [Empire.PanafricanUnion]: PanafricanUnionA,
  [Empire.RepublicOfEurope]: RepublicOfEuropeA
}

export const empireBackground = {
  [Empire.AztecEmpire]: AztecEmpireBackground,
  [Empire.FederationOfAsia]: FederationOfAsiaBackground,
  [Empire.NoramStates]: NoramStatesBackground,
  [Empire.PanafricanUnion]: PanafricanUnionBackground,
  [Empire.RepublicOfEurope]: RepublicOfEuropeBackground
}

export const empireAvatar = {
  [Empire.AztecEmpire]: AztecEmpireAvatar,
  [Empire.FederationOfAsia]: FederationOfAsiaAvatar,
  [Empire.NoramStates]: NoramStatesAvatar,
  [Empire.PanafricanUnion]: PanafricanUnionAvatar,
  [Empire.RepublicOfEurope]: RepublicOfEuropeAvatar
}

type Props = {
  player: Player
  withResourceDrop?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const EmpireCard: FunctionComponent<Props> = ({player, withResourceDrop = false, ...props}) => {
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.RESOURCE,
    canDrop: () => withResourceDrop,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.RESOURCE,
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard) => play(placeResource(player.empire, item.resource))
  })
  return (
    <div ref={ref} {...props} css={getStyle(isValidTarget, isOver)}>
      <img src={empireFaceA[player.empire]} css={imgStyle} draggable="false"/>
      {player.empireCardResources.map((resource, index) => <ResourceCube key={index} resource={resource} css={getResourceStyle(index)}/>)}
      <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} css={financiersPilePosition}/>
      <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} css={generalsPilePosition}/>
    </div>
  )
}

const getStyle = (isValidTarget: boolean, isOver: boolean) => css`
  transform-origin: bottom left;
  border-radius: 5%;
  transition: transform 0.2s ease-in-out;
  ${isValidTarget && validTargetStyle};
  ${isOver && overStyle};
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

const imgStyle = css`
  height: 100%;
  border-radius: 5%;
  box-shadow: 0 0 2px black;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
`

const getResourceStyle = (index: number) => css`
  position: absolute;
  width: 10%;
  right: ${resourcePosition[index][0]}%;
  top: ${resourcePosition[index][1]}%;
`

const resourcePosition = [
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

export function getEmpireName(t: TFunction, empire: Empire) {
  switch (empire) {
    case Empire.AztecEmpire:
      return t('Empire d’Azteca')
    case Empire.FederationOfAsia:
      return t('Fédération d’Asie')
    case Empire.NoramStates:
      return t('États du Noram')
    case Empire.PanafricanUnion:
      return t('Union Panafricaine')
    case Empire.RepublicOfEurope:
      return t('République d’Europa')
  }
}

export default EmpireCard