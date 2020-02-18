import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {useAnimation, useGame} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {Phase, Player} from '../ItsAWonderfulWorld'
import {height as cardHeight, width as cardWidth} from '../material/developments/DevelopmentCard'
import EmpireCard from '../material/empires/EmpireCard'
import {DiscardLeftoverCardsView} from '../moves/DiscardLeftoverCards'
import MoveType from '../moves/MoveType'
import {numberOfCardsDrafted} from '../rules'
import ConstructedCardsArea, {constructedCardLeftMargin} from './ConstructedCardsArea'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import PlayerHand, {bottomMargin as handBottomMargin} from './PlayerHand'
import RecyclingDropArea from './RecyclingDropArea'

const margin = 1
const areaBorders = 0.3

const DisplayedEmpire: FunctionComponent<{ player: Player }> = ({player}) => {
  const game = useGame<ItsAWonderfulWorld>()
  const discardingLeftoverCards = useAnimation<DiscardLeftoverCardsView>(animation => animation.move.type == MoveType.DiscardLeftoverCards)
  const areaWidth = numberOfCardsDrafted * (cardWidth + margin) + margin + areaBorders * 2
  const areaHeight = cardHeight + margin * 2 + areaBorders * 2
  const areaStyle = css`
    position: absolute;
    height: ${areaHeight}vh;
    width: ${game.players.length == 2 ? 'auto' : areaWidth + 'vh'};
    left: ${constructedCardLeftMargin + cardWidth + margin * 2}vh;
    right: ${margin}vh;
    will-change: transform;
    transform: translateY(-${cardHeight + handBottomMargin}vh);
    transition: transform ${discardingLeftoverCards?.duration || 0}s ease-in-out;
    border-radius: 1vh;
    border-style: dashed;
    border-width: ${areaBorders}vh;
  `
  const draftAreaStyle = css`
    ${areaStyle};
    bottom: ${margin}vh;
  `
  const constructionAreaStyle = css`
    ${areaStyle};
    bottom: ${areaHeight + margin * 2}vh;
  `
  const getAreaCardPosition = (index: number) => css`
    position: absolute;
    top: ${margin}vh;
    left: ${margin + index * cardWidth}vh;
  `
  return (
    <Fragment>
      <EmpireCard empire={player.empire} position={bottomLeft}/>
      <DraftArea player={player} css={draftAreaStyle} getAreaCardPosition={getAreaCardPosition}/>
      {(game.round > 1 || game.phase != Phase.Draft) && <ConstructionArea player={player} css={constructionAreaStyle}
                                                                          getAreaCardPosition={getAreaCardPosition}/>}
      <RecyclingDropArea empire={player.empire}/>
      <ConstructedCardsArea player={player} margin={margin}/>
      <PlayerHand player={player} margin={margin} areaBorders={areaBorders}/>
    </Fragment>
  )
}

const bottomLeft = css`
  position: absolute;
  bottom: ${margin}vh;
  left: ${margin}vh;
`

export default DisplayedEmpire