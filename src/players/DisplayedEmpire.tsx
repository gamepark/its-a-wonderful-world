import {css} from '@emotion/core'
import {usePlayerId} from '@interlude-games/workshop'
import React, {Fragment, FunctionComponent} from 'react'
import {isPlayerView, ItsAWonderfulWorldView, Phase, Player, PlayerView} from '../ItsAWonderfulWorld'
import {height as cardHeight, ratio as cardRatio, width as cardWidth} from '../material/developments/DevelopmentCard'
import EmpireCard from '../material/empires/EmpireCard'
import EmpireName from '../material/empires/EmpireName'
import ConstructedCardsArea, {constructedCardLeftMargin} from './ConstructedCardsArea'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import OtherPlayerHand from './OtherPlayerHand'
import PlayerHand from './PlayerHand'
import {playerPanelWidth} from './PlayerPanel'
import RecyclingDropArea from './RecyclingDropArea'

export const bottomMargin = 3

const DisplayedEmpire: FunctionComponent<{ game: ItsAWonderfulWorldView, player: Player | PlayerView, showAreas: boolean }> = ({game, player, showAreas}) => {
  const playerId = usePlayerId<EmpireName>()
  return (
    <Fragment>
      <EmpireCard player={player} css={empireCardStyle} withResourceDrop={playerId === player.empire}/>
      {showAreas && <DraftArea game={game} player={player}/>}
      {showAreas && (game.round > 1 || game.phase !== Phase.Draft) && <ConstructionArea game={game} player={player}/>}
      {showAreas && <RecyclingDropArea empire={player.empire}/>}
      <ConstructedCardsArea player={player}/>
      {isPlayerView(player) ? <OtherPlayerHand player={player} leftPosition={handLeftPosition(game.players.length)}/>
        : <PlayerHand player={player} leftPosition={handLeftPosition(game.players.length)}/>}
    </Fragment>
  )
}

const empireCardStyle = css`
  position: absolute;
  bottom: 2%;
  left: -4%;
  height: ${cardHeight * cardRatio}%;
  width: ${cardWidth / cardRatio}%;
`

const handLeftPosition = (players: number) => {
  if (players <= 2) {
    return 50 + (constructedCardLeftMargin + 1) / 2
  } else {
    return 50 + (constructedCardLeftMargin + 1) / 2 - (playerPanelWidth + 1) / 2
  }
}

export default DisplayedEmpire