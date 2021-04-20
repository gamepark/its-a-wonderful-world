/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {getItemQuantity, getVictoryPointsBonusMultiplier} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import Character, {characters} from '@gamepark/its-a-wonderful-world/material/Character'
import DevelopmentType, {developmentTypes} from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {useOptions, usePlayer} from '@gamepark/react-client'
import {GameSpeed} from '@gamepark/rules-api'
import Avatar from 'avataaars'
import {HTMLAttributes, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {empireAvatar} from '../material/empires/EmpireCard'
import gamePointIcon from '../util/game-point.svg'
import {empireBackground, gameOverDelay, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY} from '../util/Styles'
import PlayerConstructions from './PlayerConstructions'
import PlayerResourceProduction from './PlayerResourceProduction'
import Timer from './Timer'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  player: Player | PlayerView
  position: number
} & HTMLAttributes<HTMLDivElement>

export default function PlayerPanel({player, position, ...props}: Props) {
  const {t} = useTranslation()
  const options = useOptions()
  const playerInfo = usePlayer<EmpireName>(player.empire)
  const bestMultiplier = getBestVictoryPointsMultiplier(player)
  const [gamePoints, setGamePoints] = useState(playerInfo?.gamePointsDelta)
  useEffect(() => {
    if (typeof playerInfo?.gamePointsDelta === 'number' && typeof gamePoints !== 'number') {
      setTimeout(() => setGamePoints(playerInfo?.gamePointsDelta), gameOverDelay * 1000)
    }
  }, [playerInfo, gamePoints])
  return (
    <div css={style(player.empire, position)} {...props}>
      {playerInfo?.avatar ?
        <Avatar style={{position: 'absolute', width: '16%', height: '34%', top: '0%', left: '3%', filter: 'drop-shadow(0px 0.2em 0.4em black)'}}
                avatarStyle="Circle" {...playerInfo?.avatar}/> :
        <img alt={t('Player avatar')} src={empireAvatar[player.empire]} css={avatarStyle} draggable="false"/>
      }
      <h3 css={titleStyle}>
        <span css={[nameStyle, player.eliminated && eliminatedStyle]}>{playerInfo?.name || getPlayerName(player.empire, t)}</span>
        {options?.speed === GameSpeed.RealTime && playerInfo?.time?.playing && !player.eliminated && <Timer time={playerInfo.time}/>}
        {typeof gamePoints === 'number' &&
        <span css={css`flex-shrink: 0`}>
          <img src={gamePointIcon} alt="Game point icon" css={gamePointIconStyle}/>
          {gamePoints > 0 && '+'}{playerInfo?.gamePointsDelta}
        </span>
        }
      </h3>
      <PlayerResourceProduction player={player}/>
      {bestMultiplier && <VictoryPointsMultiplier item={bestMultiplier.item} multiplier={bestMultiplier.multiplier} css={victoryPointsMultiplierStyle}/>}
      <PlayerConstructions player={player}/>
    </div>
  )
}

const style = (empire: EmpireName, position: number) => css`
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

const avatarStyle = css`
  position: absolute;
  height: 30%;
  top: 4%;
  left: 3%;
  border: 0.1em solid white;
  border-radius: 100%;
`

const titleStyle = css`
  color: #333333;
  position: absolute;
  top: 8%;
  left: 22%;
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

const gamePointIconStyle = css`
  height: 1em;
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
      const score = multiplier * getItemQuantity(player, item)
      if (!bestMultiplier || bestMultiplier.score < score || (bestMultiplier.score === score && bestMultiplier.multiplier < multiplier)) {
        bestMultiplier = {item, multiplier, score}
      }
    }
  }
  return bestMultiplier
}