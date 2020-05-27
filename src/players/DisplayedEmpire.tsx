import {usePlayerId} from '@interlude-games/workshop'
import React, {Fragment, FunctionComponent} from 'react'
import EmpireCard from '../material/empires/EmpireCard'
import EmpireName from '../material/empires/EmpireName'
import GameView from '../types/GameView'
import Phase from '../types/Phase'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import ConstructedCardsArea from './ConstructedCardsArea'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import OtherPlayerHand from './OtherPlayerHand'
import PlayerHand from './PlayerHand'
import RecyclingDropArea from './RecyclingDropArea'

const DisplayedEmpire: FunctionComponent<{ game: GameView, player: Player | PlayerView, showAreas: boolean }> = ({game, player, showAreas}) => {
  const playerId = usePlayerId<EmpireName>()
  return (
    <Fragment>
      <EmpireCard player={player} withResourceDrop={playerId === player.empire}/>
      {showAreas && <DraftArea game={game} player={player}/>}
      {showAreas && (game.round > 1 || game.phase !== Phase.Draft) && <ConstructionArea game={game} player={player}/>}
      {showAreas && <RecyclingDropArea empire={player.empire}/>}
      <ConstructedCardsArea player={player}/>
      {isPlayer(player) ?
        <PlayerHand player={player} players={game.players.length} round={game.round}/> :
        <OtherPlayerHand player={player} players={game.players.length}/>
      }
    </Fragment>
  )
}

export default DisplayedEmpire