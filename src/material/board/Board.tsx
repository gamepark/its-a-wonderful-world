import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import GameView from '../../types/GameView'
import Phase from '../../types/Phase'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayer} from '../../types/typeguards'
import {isResource} from '../resources/Resource'
import boardReduced from './board-reduced.png'
import board from './board.png'
import ResourceArea from './ResourceArea'
import roundTracker1 from './round-tracker-1-3.png'
import roundTracker2 from './round-tracker-2-4.png'

const Board: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const {t} = useTranslation()
  const reducedSize = game.phase === Phase.Draft && game.round > 1
  const resources = [...player.availableResources, ...player.bonuses.filter(isResource)]
  return (
    <>
      <div css={style(reducedSize)}>
        <img src={board} css={imageStyle(reducedSize)} alt={t('Le plateau de jeu')} draggable="false"/>
        <img src={boardReduced} css={reducedImageStyle(reducedSize)} alt={t('Le plateau de jeu')} draggable="false"/>
        <img alt={t('Le marqueur de tour')} src={game.round % 2 ? roundTracker1 : roundTracker2} draggable="false"
             css={roundTrackerStyle(game.round, reducedSize)}/>
        {reducedSize && <span css={roundTextStyle}>{game.round}</span>}
      </div>
      {[...new Set(resources)].map(resource =>
        <ResourceArea key={resource} game={game} player={player} resource={resource} canDrag={isPlayer(player)}
                      quantity={resources.filter(r => r === resource).length}/>)}
    </>
  )
}

const style = (reducedSize = false) => css`
  position: absolute;
  height: 34%;
  width: 54%;
  top: 9%;
  left: 50%;
  transform: translateX(-50%);
  transition: transform 0.5s ease-in-out;
  ${reducedSize && css`transform: translate(-50%, -30%) scale(0.6)`}
`

const imageStyle = (reducedSize = false) => css`
  height: 100%;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  opacity: ${reducedSize ? 0 : 1};
  transition: opacity 0.5s ease-in-out;
`

const reducedImageStyle = (reducedSize = false) => css`
  position: absolute;
  height: 51.1%;
  top: 12.3%;
  left: 1.9%;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  opacity: ${reducedSize ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
`

const roundTrackerStyle = (round: number, reducedSize = false) => css`
  position: absolute;
  height: 10%;
  top: 4.1%;
  left: ${round === 1 ? 36.65 : round === 2 ? 40.6 : round === 3 ? 50.4 : 54.35}%;
  transition: left 0.5s ease-in-out, transform 0.5s ease-in-out;
  ${reducedSize && roundTrackerReducedStyle};
`

const roundTrackerReducedStyle = css`
  left: 110%;
  transform: translateY(260%) scale(3);
`

const roundTextStyle = css`
  position: absolute;
  top: 27%;
  left: 110.5%;
  font-size: 5vh;
  color: #333333;
  font-weight: bold;
  transition: opacity 0.5s ease-in-out;
`

export default Board