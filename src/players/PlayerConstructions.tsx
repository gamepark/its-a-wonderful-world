import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from '../material/characters/Character'
import CharacterTokenNumber from '../material/characters/CharacterTokenNumber'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'

const PlayerConstructions: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => (
  <div css={[extraInfoPosition, player.characters[Character.General] > player.characters[Character.Financier] && reverseOrder]}>
    <CharacterTokenNumber character={Character.Financier} quantity={player.characters[Character.Financier]} css={itemPosition}/>
    <CharacterTokenNumber character={Character.General} quantity={player.characters[Character.General]} css={itemPosition}/>
  </div>
)

const extraInfoPosition = css`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 2%;
  top: 64%;
  width: 24%;
  height: 30%;
  transition: width 0.5s ease-out, height 0.5s ease-in;
`

const reverseOrder = css`
  flex-direction: row-reverse;
`

const itemPosition = css`
  position: relative;
  width: 48%;
  height: auto;
  margin-right: 4%;
`

export default PlayerConstructions