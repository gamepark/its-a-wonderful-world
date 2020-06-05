import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import GameView from '../../types/GameView'
import Phase from '../../types/Phase'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayer} from '../../types/typeguards'
import {isResource} from '../resources/Resource'
import boardCircleGrey from './board-circle-grey.png'
import boardCircleBlack from './board-circle-black.png'
import boardCircleGreen from './board-circle-green.png'
import boardCircleYellow from './board-circle-yellow.png'
import boardCircleBlue from './board-circle-blue.png'
import boardCircleFinancier from '../characters/circle-financier.png'
import boardCircleGeneral from '../characters/circle-general.png'
import boardCircleFinancierGeneral from '../characters/circle-financier-general.png'
import boardArrow from './arrow-white-2.png'
import ResourceArea from './ResourceArea'

const Board: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const {t} = useTranslation()
  const reducedSize = game.phase === Phase.Draft && game.round > 1
  const resources = [...player.availableResources, ...player.bonuses.filter(isResource)]
  return (
    <>
      <div css={style(reducedSize)}>
        <div css={boardCircles}>
        <img src={boardCircleGrey} css={circleStyle} alt={t('Matériaux')} draggable="false"/>
        <img src={boardArrow} css={arrowStyle} alt={t('Validation des Matériaux')} draggable="false"/>
        <img src={boardCircleBlack} css={circleStyle} alt={t('Énergies')} draggable="false"/>
        <img src={boardArrow} css={arrowStyle} alt={t('Validation des Énergies')} draggable="false"/>
        <img src={boardCircleGreen} css={circleStyle} alt={t('Sciences')} draggable="false"/>
        <img src={boardArrow} css={arrowStyle} alt={t('Validation des Sciences')} draggable="false"/>
        <img src={boardCircleYellow} css={circleStyle} alt={t('Ors')} draggable="false"/>
        <img src={boardArrow} css={arrowStyle} alt={t('Validation des Ors')} draggable="false"/>
        <img src={boardCircleBlue} css={circleStyle} alt={t('Explorations')} draggable="false"/>
        <img src={boardArrow} css={arrowStyle} alt={t('Validation des Explorations')} draggable="false"/>
        <img src={boardCircleFinancier} css={greyFinancierStyle} alt={t('Financier des Matériaux')} draggable="false"/>
        <img src={boardCircleGeneral} css={blackGeneralStyle} alt={t('Général des Énergies')} draggable="false"/>
        <img src={boardCircleFinancierGeneral} css={greenFinancierGeneralStyle} alt={t('Financier et Général des Sciences')} draggable="false"/>
        <img src={boardCircleFinancier} css={yellowFinancierStyle} alt={t('Financier des Ors')} draggable="false"/>
        <img src={boardCircleGeneral} css={bleuGeneralStyle} alt={t('Général des Explorations')} draggable="false"/>
        </div>
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
  width: 69%;
  top: 9%;
  left: 45%;
  transform: translateX(-50%);
  transition: transform 0.5s ease-in-out;
  ${reducedSize && css`transform: translate(-60%, -48%) scale(0.5); `}
`

const boardCircles = css`
  position: absolute;
  width: 98%;
  bottom: 1%;
  left: 1%;
`

const circleStyle = css`
  width: 15%;
  vertical-align: middle;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  transition: opacity 0.5s ease-in-out;
`
const arrowStyle = css`
  width: 5%;
  vertical-align: middle;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  transition: opacity 0.5s ease-in-out;
`
const greyFinancierStyle = css`
  position:absolute;
  width: 2.5%;
  top:6%;
  left:6.2%;
  transition: opacity 0.5s ease-in-out;
`

const blackGeneralStyle = css`
  position:absolute;
   width: 2.5%;
  top:6%;
  left:26.25%;
  transition: opacity 0.5s ease-in-out;
`

const greenFinancierGeneralStyle = css`
  position:absolute;
  width: 2.5%;
  top:7%;
  left:46.25%;
  transition: opacity 0.5s ease-in-out;
`

const yellowFinancierStyle = css`
  position:absolute;
  width: 2.5%;
  top:6%;
  left:66.25%;
  transition: opacity 0.5s ease-in-out;
`

const bleuGeneralStyle = css`
  position:absolute;
  width: 2.5%;
  top:6%;
  left:86.25%;
  transition: opacity 0.5s ease-in-out;
`

export default Board