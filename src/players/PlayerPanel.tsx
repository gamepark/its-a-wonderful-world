import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {Player} from '../ItsAWonderfulWorld'
import Empire from '../material/empires/Empire'
import {empireAvatar, empireBackground, getEmpireName} from '../material/empires/EmpireCard'
import Energy from '../material/resources/energy.png'
import Exploration from '../material/resources/exploration.png'
import Gold from '../material/resources/gold.png'
import Materials from '../material/resources/materials.png'
import Resource from '../material/resources/Resource'
import Science from '../material/resources/science.png'
import {getProduction} from '../rules'

const resourceIcon = {
  [Resource.Materials]: Materials,
  [Resource.Energy]: Energy,
  [Resource.Science]: Science,
  [Resource.Gold]: Gold,
  [Resource.Exploration]: Exploration
}

const PlayerPanel: FunctionComponent<{ player: Player, position: number }> = ({player, position}) => {
  const {t} = useTranslation()
  return (
    <div css={style(player.empire, position)}>
      <img src={empireAvatar[player.empire]} css={avatarStyle}/>
      <h3 css={nameStyle}>{getEmpireName(t, player.empire)}</h3>
      {Object.values(Resource).flatMap(resource => Array(getProduction(player, resource)).fill(resource)).map((resource, index) =>
        <img key={index} src={resourceIcon[resource]} css={productionStyle(index)}/>)}
    </div>
  )
}

const style = (empire: Empire, position: number) => css`
  position: absolute;
  top: ${8.5 + position * 18.5}%;
  right: 1%;
  width: 20%;
  height: 17%;
  border: 2px solid lightslategrey;
  border-radius: 5px;
  background-image: url(${empireBackground[empire]});
  background-size: cover;
  background-position: center;
  box-shadow: -1px 3px 10px black;
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

const productionStyle = (index: number) => {
  if (index < 6) {
    return css`
      position: absolute;
      top: 35%;
      left: ${18 + index * 13}%;
      width: 12%;
      filter: drop-shadow(1px 1px 3px black);
    `
  } else {
    return css`
      position: absolute;
      top: 60%;
      left: ${24 + (index - 6) * 13}%;
      width: 12%;
      filter: drop-shadow(1px 1px 3px black);
    `
  }
}

export default PlayerPanel