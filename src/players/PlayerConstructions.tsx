import React, {FunctionComponent} from 'react'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import Character, {characterTypes} from '../material/characters/Character'
import {css} from '@emotion/core'
import {getItemQuantity} from '../Rules'
import CharacterTokenNumber from '../material/characters/CharacterTokenNumber'

// Display player's tokens and constructions
const PlayerConstructions: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => {
  const financierQuantity = getItemQuantity(player, Character.Financier)
  const generalQuantity = getItemQuantity(player, Character.General)
  const reverseTypes = characterTypes.slice().reverse()
  return (
    <div css={extraInfoPosition}>
      { financierQuantity >= generalQuantity ?
        characterTypes.map( characterType =>  <CharacterTokenNumber key={characterType} character={characterType} quantity={getItemQuantity(player, characterType)} css={itemPosition} />)
        :
        reverseTypes.map( characterType =>  <CharacterTokenNumber key={characterType} character={characterType} quantity={getItemQuantity(player, characterType)} css={itemPosition} />)
      }
    </div>
  )
}

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

const itemPosition = css`
  position:relative;
  width: 48%;
  height:auto;
  margin-right:4%;
`

export default PlayerConstructions