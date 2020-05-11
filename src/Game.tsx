import {css} from '@emotion/core'
import {Letterbox, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useState} from 'react'
import {ItsAWonderfulWorldView, Phase} from './ItsAWonderfulWorld'
import Board from './material/board/Board'
import DraftDirectionIndicator from './material/board/DraftDirectionIndicator'
import DiscardPile from './material/developments/DiscardPile'
import DrawPile from './material/developments/DrawPile'
import EmpireName from './material/empires/EmpireName'
import Resource from './material/resources/Resource'
import DisplayedEmpire from './players/DisplayedEmpire'
import PlayerPanel from './players/PlayerPanel'
import {numberOfRounds} from './Rules'

const Game: FunctionComponent<{ game: ItsAWonderfulWorldView }> = ({game}) => {
  const gameOver = game.round === numberOfRounds && game.phase === Phase.Production && game.productionStep === Resource.Exploration && game.players.every(player => player.ready)
  const playerId = usePlayerId<EmpireName>()
  const [displayedEmpire, setDisplayedEmpire] = useState(playerId || game.players[0].empire)
  const displayedPlayer = game.players.find(player => player.empire === displayedEmpire)!
  let playersStartingWithMyself = game.players
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.empire === playerId)
    playersStartingWithMyself = [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  }
  return (
    <Letterbox css={hiddenOnPortrait}>
      {!gameOver && <Board game={game} player={displayedPlayer}/>}
      {!gameOver && <DrawPile game={game}/>}
      {!gameOver && <DiscardPile game={game}/>}
      <DisplayedEmpire game={game} player={displayedPlayer} showAreas={!gameOver}/>
      {game.players.length > 2 && game.phase === Phase.Draft &&
      <DraftDirectionIndicator clockwise={game.round % 2 === 1} players={playersStartingWithMyself}/>}
      {playersStartingWithMyself.map((player, index) =>
        <PlayerPanel key={player.empire} player={player} position={index} onClick={() => setDisplayedEmpire(player.empire)}
                     highlight={player.empire === displayedEmpire} showScore={gameOver}/>
      )}
    </Letterbox>
  )
}

const hiddenOnPortrait = css`
  @media all and (orientation:portrait) {
    display: none !important;
  }
`

export default Game