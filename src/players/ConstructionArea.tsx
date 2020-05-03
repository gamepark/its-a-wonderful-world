import {css} from '@emotion/core'
import {usePlay, usePlayerId} from '@interlude-games/workshop'
import React, {Fragment, FunctionComponent, useState} from 'react'
import {useDrop} from 'react-dnd'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import {ItsAWonderfulWorldView, Phase, Player, PlayerView} from '../ItsAWonderfulWorld'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube from '../material/resources/ResourceCube'
import {placeResource, PlaceResourceOnConstruction} from '../moves/PlaceResource'
import {slateForConstruction} from '../moves/SlateForConstruction'
import {getRemainingCost} from '../Rules'
import DevelopmentCardUnderConstruction from './DevelopmentCardUnderConstruction'
import {getAreaCardStyle, getAreasStyle} from './DraftArea'

const ConstructionArea: FunctionComponent<{ game: ItsAWonderfulWorldView, player: Player | PlayerView }> = ({game, player}) => {
  const playerId = usePlayerId()
  const [focusedCard, setFocusedCard] = useState<number>()
  const row = game.phase === Phase.Draft ? 2 : 1
  const fullWidth = game.players.length === 2 && game.phase !== Phase.Draft
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromDraftArea) => play(slateForConstruction(player.empire, item.card))
  })
  return <>
    {focusedCard && <Fragment>
      <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
      {getSmartPlaceResourceMoves(player, focusedCard).map(move =>
        <a key={move.space} css={getPlaceResourceButtonStyle(move.space)} onClick={() => play(move)}>
          <ResourceCube resource={move.resource} css={buttonResourceStyle}/>⇒
        </a>
      )}
    </Fragment>}
    <div ref={ref} css={getConstructionAreaStyle(row, fullWidth, isValidTarget, isOver)}>
      {!player.constructionArea.length && <span css={constructionAreaText}>Zone de construction</span>}
    </div>
    {player.constructionArea.map((construction, index) => {
        return <DevelopmentCardUnderConstruction key={construction.card} game={game} player={player} developmentUnderConstruction={construction}
                                                 setFocus={() => setFocusedCard(construction.card)}
                                                 canRecycle={player.empire === playerId && focusedCard !== construction.card && row !== 2}
                                                 onClick={() => setFocusedCard(construction.card)}
                                                 focused={focusedCard === construction.card}
                                                 css={getAreaCardStyle(row, index, player.constructionArea.length, fullWidth, focusedCard === construction.card)}/>
      }
    )}
  </>
}

function getSmartPlaceResourceMoves(player: Player | PlayerView, card: number) {
  const moves: PlaceResourceOnConstruction[] = []
  const construction = player.constructionArea.find(construction => construction.card === card)!
  const availableResource = JSON.parse(JSON.stringify(player.availableResources))
  const krystalliumAvailable = player.empireCardResources.filter(resource => resource === Resource.Krystallium).length
  const availableKrystalliumPerResource: Record<Resource, number> = {
    [Resource.Materials]: krystalliumAvailable,
    [Resource.Energy]: krystalliumAvailable,
    [Resource.Science]: krystalliumAvailable,
    [Resource.Gold]: krystalliumAvailable,
    [Resource.Exploration]: krystalliumAvailable,
    [Resource.Krystallium]: krystalliumAvailable
  }
  getRemainingCost(construction).forEach(cost => {
    if (isResource(cost.item)) {
      if (availableResource[cost.item] > 0) {
        moves.push(placeResource(player.empire, cost.item, construction.card, cost.space))
        availableResource[cost.item]--
      } else if (availableKrystalliumPerResource[cost.item] > 0) {
        moves.push(placeResource(player.empire, Resource.Krystallium, construction.card, cost.space))
        availableKrystalliumPerResource[cost.item]--
      }
    }
  })
  return moves
}

const getConstructionAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(255, 0, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: crimson;
  ${getAreasStyle(row, fullWidth, isValidTarget)};
`

const constructionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 4vh;
  color: crimson;
`

const popupBackgroundStyle = css`
  position: fixed;
  top: -100%;
  bottom: -100%;
  left: -100%;
  right: -100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`

const getPlaceResourceButtonStyle = (index: number) => css`
  position: absolute;
  z-index: 100;
  top: ${index * 6.5 + 16.5}%;
  left: 29%;
  display: inline-flex;
  box-shadow: inset 0 0.1vh 0 0 #ffffff;
  background: #ededed linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
  border-radius: 2vh;
  border: 0.1vh solid #dcdcdc;
  color: #333333;
  padding: 0 2vh;
  align-items: center;
  font-size: 4.8vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  &:hover {
    background: #dfdfdf linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
  }
  &:active {
    position:relative;
    transform: translateY(1px);
  }
`

const buttonResourceStyle = css`
  display: inline;
  height: 3.5vh;
  margin: 0 1.5vh 0 0.5vh;
`

export default ConstructionArea