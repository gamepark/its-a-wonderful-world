import {css} from '@emotion/core'
import {usePlayer} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character from '../material/characters/Character'
import DevelopmentType from '../material/developments/DevelopmentType'
import {empireAvatar, empireBackground, getEmpireName} from '../material/empires/EmpireCard'
import EmpireName from '../material/empires/EmpireName'
import {getVictoryPointsBonusMultiplier} from '../Rules'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import PlayerResourceProduction from './PlayerResourceProduction'
import PlayerScore from './score/PlayerScore'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  player: Player | PlayerView
  position: number
  highlight: boolean
  showScore: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerPanel: FunctionComponent<Props> = ({player, position, highlight, showScore, ...props}) => {
  const {t} = useTranslation()
  const playerInfo = usePlayer<EmpireName>(player.empire)
  const victoryPointsMultipliers: { item: Character | DevelopmentType, multiplier: number }[] = []
  const completeVictoryPointsMultiplier = (item: Character | DevelopmentType) => {
    const multiplier = getVictoryPointsBonusMultiplier(player, item)
    if (multiplier > 0) {
      victoryPointsMultipliers.push({item, multiplier})
    }
  }
  Object.values(Character).forEach(completeVictoryPointsMultiplier)
  Object.values(DevelopmentType).forEach(completeVictoryPointsMultiplier)
  victoryPointsMultipliers.sort((item1, item2) => item2.multiplier - item1.multiplier)
  return (
    <div css={style(player.empire, position, highlight)} {...props}>
      <img alt={t('Avatar du joueur')} src={empireAvatar[player.empire]} css={avatarStyle} draggable="false"/>
      <h3 css={nameStyle}>{playerInfo?.name || getEmpireName(t, player.empire)}</h3>
      <PlayerResourceProduction player={player}/>
      {victoryPointsMultipliers.slice(0, 3).map((victoryPointsMultiplier, index) =>
        <VictoryPointsMultiplier key={victoryPointsMultiplier.item} item={victoryPointsMultiplier.item} multiplier={victoryPointsMultiplier.multiplier}
                                 css={victoryPointsMultiplierStyle(index)}/>
      )}
      {showScore && <PlayerScore player={player}/>}
    </div>
  )
}

export const playerPanelWidth = 20

const style = (empire: EmpireName, position: number, highlight: boolean) => css`
  position: absolute;
  top: ${8.5 + position * 18.2}%;
  right: 1%;
  width: ${playerPanelWidth}%;
  height: 16.7%;
  border-radius: 5px;
  background-image: url(${empireBackground[empire]});
  background-size: cover;
  background-position: center;
  ${borderStyle(highlight)};
`

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 0.2vh solid gold;
  box-shadow: 0.2vh 0.2vh 1vh gold;
` : css`
  border: 0.2vh solid lightslategrey;
  box-shadow: 0.2vh 0.2vh 1vh black;
  cursor: pointer;
  &:hover {
    border: 0.2vh solid rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 0.5vh gold;
  }
`

const avatarStyle = css`
  position: absolute;
  height: 25%;
  top: 5%;
  left: 3%;
  border: 1px solid white;
  border-radius: 100%;
`

const nameStyle = css`
  color: #333333;
  position: absolute;
  top: 8%;
  left: 18%;
  right: 3%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
  font-size: 2.9vh;
  font-weight: bold;
`

const victoryPointsMultiplierStyle = (index: number) => css`
  position: absolute;
  top: ${index * 22 + 33}%;
  left: 3%;
  width: 15%;
  height: 20%;
`

export default PlayerPanel