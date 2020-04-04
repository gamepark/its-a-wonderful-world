import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {Player} from '../ItsAWonderfulWorld'
import Character from '../material/characters/Character'
import DevelopmentType from '../material/developments/DevelopmentType'
import Empire from '../material/empires/Empire'
import {empireAvatar, empireBackground, getEmpireName} from '../material/empires/EmpireCard'
import {getVictoryPointsMultiplier} from '../rules'
import PlayerResourceProduction from './PlayerResourceProduction'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  player: Player
  position: number
  highlight?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerPanel: FunctionComponent<Props> = ({player, position, highlight = false, ...props}) => {
  const {t} = useTranslation()
  const victoryPointsMultipliers: { item: Character | DevelopmentType, multiplier: number }[] = []
  const completeVictoryPointsMultiplier = (item: Character | DevelopmentType) => {
    const multiplier = getVictoryPointsMultiplier(player, item)
    if (multiplier > 0) {
      victoryPointsMultipliers.push({item, multiplier})
    }
  }
  Object.values(Character).forEach(completeVictoryPointsMultiplier)
  Object.values(DevelopmentType).forEach(completeVictoryPointsMultiplier)
  victoryPointsMultipliers.sort((item1, item2) => item2.multiplier - item1.multiplier)
  return (
    <div css={style(player.empire, position, highlight)} {...props}>
      <img src={empireAvatar[player.empire]} css={avatarStyle} draggable="false"/>
      <h3 css={nameStyle}>{getEmpireName(t, player.empire)}</h3>
      <PlayerResourceProduction player={player}/>
      {victoryPointsMultipliers.slice(0, 3).map((victoryPointsMultiplier, index) =>
        <VictoryPointsMultiplier key={victoryPointsMultiplier.item} item={victoryPointsMultiplier.item} multiplier={victoryPointsMultiplier.multiplier} css={victoryPointsMultiplierStyle(index)}/>
      )}
    </div>
  )
}

export const playerPanelWidth = 20

const style = (empire: Empire, position: number, highlight: boolean) => css`
  position: absolute;
  top: ${8.5 + position * 18.5}%;
  right: 1%;
  width: ${playerPanelWidth}%;
  height: 17%;
  border-radius: 5px;
  background-image: url(${empireBackground[empire]});
  background-size: cover;
  background-position: center;
  ${borderStyle(highlight)};
`

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 2px solid gold;
  box-shadow: -1px 3px 10px gold;
` : css`
  border: 2px solid lightslategrey;
  box-shadow: -1px 3px 10px black;
  cursor: pointer;
  &:hover {
    border: 2px solid rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 5px gold;
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