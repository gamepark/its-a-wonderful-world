import {css} from '@emotion/core'
import {GameSpeed, useOptions, usePlayer} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character, {characters} from '../material/characters/Character'
import DevelopmentType, {developmentTypes} from '../material/developments/DevelopmentType'
import {empireAvatar, getEmpireName} from '../material/empires/EmpireCard'
import EmpireName from '../material/empires/EmpireName'
import {getComboVictoryPoints, getVictoryPointsBonusMultiplier} from '../Rules'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {empireBackground, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY} from '../util/Styles'
import PlayerConstructions from './PlayerConstructions'
import PlayerResourceProduction from './PlayerResourceProduction'
import Timer from './Timer'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  player: Player | PlayerView
  position: number
  highlight: boolean
  showScore: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerPanel: FunctionComponent<Props> = ({player, position, highlight, showScore, ...props}) => {
  const {t} = useTranslation()
  const options = useOptions()
  const playerInfo = usePlayer<EmpireName>(player.empire)
  const bestMultiplier = getBestVictoryPointsMultiplier(player)
  return (
    <div css={style(player.empire, position, highlight)} {...props}>
      <img alt={t('Avatar du joueur')} src={empireAvatar[player.empire]} css={avatarStyle} draggable="false"/>
      <h3 css={[titleStyle, player.eliminated && eliminatedStyle]}>
        <span css={nameStyle}>{playerInfo?.name || getEmpireName(t, player.empire)}</span>
        {options?.speed === GameSpeed.RealTime && playerInfo?.time?.playing && <Timer time={playerInfo.time}/>}
      </h3>
      <PlayerResourceProduction player={player}/>
      {bestMultiplier && <VictoryPointsMultiplier item={bestMultiplier.item} multiplier={bestMultiplier.multiplier} css={victoryPointsMultiplierStyle}/>}
      <PlayerConstructions player={player}/>
    </div>
  )
}

const style = (empire: EmpireName, position: number, highlight: boolean) => css`
  position: absolute;
  z-index: 1;
  top: ${playerPanelY(position)}%;
  right: ${playerPanelRightMargin}%;
  width: ${playerPanelWidth}%;
  height: ${playerPanelHeight}%;
  background-image: url(${empireBackground[empire]});
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  ${borderStyle(highlight)};
  
  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }
`

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 0.2em solid gold;
  box-shadow: 0.2em 0.2em 1em gold;
` : css`
  border: 0.2em solid lightslategrey;
  box-shadow: 0.2em 0.2em 1em black;
  cursor: pointer;
  &:hover {
    border: 0.2em solid rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 0.5em gold;
  }
`

const avatarStyle = css`
  position: absolute;
  height: 25%;
  top: 5%;
  left: 3%;
  border: 0.1em solid white;
  border-radius: 100%;
`

const titleStyle = css`
  color: #333333;
  position: absolute;
  top: 8%;
  left: 18%;
  right: 3%;
  margin: 0;
  font-size: 2.9em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const eliminatedStyle = css`
  text-decoration: line-through;
`

const victoryPointsMultiplierStyle = css`
  position: absolute;
  top: 38%;
  left: 3%;
  width: 15%;
  height: 20%;
`

type Multiplier = { item: DevelopmentType | Character, multiplier: number, score: number }

const getBestVictoryPointsMultiplier = (player: Player | PlayerView) => {
  let bestMultiplier: Multiplier | undefined = undefined
  for (const item of [...developmentTypes, ...characters]) {
    const multiplier = getVictoryPointsBonusMultiplier(player, item)
    if (multiplier) {
      const score = getComboVictoryPoints(player, item)
      if (!bestMultiplier || bestMultiplier.score < score || (bestMultiplier.score === score && bestMultiplier.multiplier < multiplier)) {
        bestMultiplier = {item, multiplier, score}
      }
    }
  }
  return bestMultiplier
}

export default PlayerPanel