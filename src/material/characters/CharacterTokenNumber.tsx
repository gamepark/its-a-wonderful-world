import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from './Character'
import CharacterToken from './CharacterToken'

type Props = {
  character: Character
  quantity: number
} & React.HTMLAttributes<HTMLDivElement>

const CharacterTokenNumber: FunctionComponent<Props> = ({character, quantity, ...props}) => {
  return (
    <>
    { quantity > 0 &&
      <div {...props}>
        <CharacterToken css={tokenStyle} character={character}/>
        <div css={tokenQuantityStyle}>{quantity}</div>
      </div>
    }
    </>
  )
}

const tokenStyle = css`
  position: relative;
  width:100%;
  height:auto;
`

const tokenQuantityStyle = css`
  position: absolute;
  bottom: -20%;
  right: 0;
  font-size: 2.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black,0 0 0.2em black,0 0 0.2em black;
`

export default CharacterTokenNumber