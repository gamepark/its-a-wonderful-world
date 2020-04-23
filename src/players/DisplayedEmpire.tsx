import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {useGame, usePlayerId} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {Phase, Player} from '../ItsAWonderfulWorld'
import EmpireName from '../material/empires/EmpireName'
import EmpireCard from '../material/empires/EmpireCard'
import ConstructedCardsArea from './ConstructedCardsArea'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import PlayerHand from './PlayerHand'
import RecyclingDropArea from './RecyclingDropArea'

const DisplayedEmpire: FunctionComponent<{ player: Player, showAreas: boolean }> = ({player, showAreas}) => {
  const game = useGame<ItsAWonderfulWorld>()
  const playerId = usePlayerId<EmpireName>()
  return (
    <Fragment>
      <EmpireCard player={player} css={empireCardStyle} withResourceDrop={playerId == player.empire}/>
      {showAreas && <DraftArea player={player}/>}
      {showAreas && (game.round > 1 || game.phase != Phase.Draft) && <ConstructionArea player={player}/>}
      {showAreas && <RecyclingDropArea empire={player.empire}/>}
      <ConstructedCardsArea player={player}/>
      <PlayerHand player={player}/>
    </Fragment>
  )
}

const empireCardStyle = css`
  position: absolute;
  bottom: 2%;
  left: -4%;
  height: 14.95%;
`

export default DisplayedEmpire