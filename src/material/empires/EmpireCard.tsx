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
import {empireCardBottomMargin, empireCardHeight, empireCardLeftMargin, empireCardWidth, glow} from '../../util/Styles'
import Character from '../characters/Character'
import CharacterTokenPile from '../characters/CharacterTokenPile'
import Resource from '../resources/Resource'
import ResourceCube from '../resources/ResourceCube'
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
import RecyclingArea from '../board/recycling-area.png'
import {useTranslation} from 'react-i18next'
import Phase from '../../types/Phase'
import GameView from '../../types/GameView'

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
  game: GameView
  player: Player | PlayerView
  withResourceDrop?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const EmpireCard: FunctionComponent<Props> = ({game, player, withResourceDrop = false, ...props}) => {
  const {t} = useTranslation()
  const play = usePlay()
  const playerId = usePlayerId<EmpireName>()
  const reducedSize = game.phase === Phase.Draft && game.round > 1
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
    <>
      <div ref={ref} {...props} css={[style, getBackgroundImage(player.empire, player.empireSide), isValidTarget && validTargetStyle, isOver && overStyle]}>
        <div css={empireCardTitle}>{player.empireSide} - {getEmpireName(t,player.empire)}</div>
    </div>

      <img src={RecyclingArea} alt={t('Recycling Area')} css={[recyclingAreaStyle, reducedSize && reducedRecyclingAreaStyle]}/>
      {player.empireCardResources.filter(resource => resource !== Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={getResourceStyle(reducedSize?1:0,index)}/>)}
      {player.empireCardResources.filter(resource => resource === Resource.Krystallium).map((resource, index) =>
        <ResourceCube key={index} resource={resource} css={[getKrystalliumStyle(index),reducedSize && reducedKrystalliumStyle(index)]} draggable={player.empire === playerId}/>)}



    <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} reduced={reducedSize} css={[financiersPilePosition, reducedSize && reducedFinanciersPilePosition]}
                      draggable={player.empire === playerId}/>
    <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} reduced={reducedSize} css={[generalsPilePosition, reducedSize && reducedGeneralsPilePosition]}
                      draggable={player.empire === playerId}/>
    </>
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
  box-shadow: 0 0 2px black;
  background-size: cover;
`

const getBackgroundImage = (empire: EmpireName, empireSide: EmpireSide) => css`
  background-image: url(${empiresImages[empire][empireSide]});
`

export const empireCardTitle = css`
  position: absolute;
  top: 71%;
  left: 6%;
  width: 64%;
  color: #EEE;
  text-align:center;
  font-size: 1.2vh;
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

const recyclingAreaStyle = css`
  position: absolute;
  left: 30%;
  top: 8%;
  height: 9%;
`

const reducedRecyclingAreaStyle = css`
  left: 56%;
`

const getResourceStyle = (reduced:number,index: number) => css`
  position: absolute;
  width: 1.7%;
  left: ${resourcePosition[reduced][index % 5][0]}%;
  top: ${resourcePosition[reduced][index % 5][1]}%;
`

const getKrystalliumStyle = (index: number) => css`
  position: absolute;
  width: 1.7%;
  left: ${42+(Math.floor(index/4) * 1.7)}%;
  bottom: ${83+(index%4 * 2.4)}%;
`

const reducedKrystalliumStyle = (index: number) => css`
  left: ${68+(Math.floor(index/4) * 1.7)}%;
`

export const resourcePosition = [
  [
  [33, 13.5],
  [31, 13.5],
  [30.3, 10],
  [32, 8.5],
  [33.5, 10]
  ],
  [
    [59, 13.5],
    [57, 13.5],
    [56.3, 10],
    [58, 8.5],
    [59.5, 10]
  ]
]

const financiersPilePosition = css`
  position: absolute;
  left: 53%;
  top: 9%;
  width: 4%;
`

const generalsPilePosition = css`
  position: absolute;
  left: 66%;
  top: 9%;
  width: 4%;
`

const reducedFinanciersPilePosition = css`
  left: 73%;
  top: 8.5%;
  width: 2%;
`

const reducedGeneralsPilePosition = css`
  left: 73%;
  top: 13.5%;
  width: 2%;
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