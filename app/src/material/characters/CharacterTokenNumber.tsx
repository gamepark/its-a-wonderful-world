/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import {HTMLAttributes} from 'react'
import CharacterToken from './CharacterToken'

type Props = {
  character: Character
  quantity: number
} & HTMLAttributes<HTMLDivElement>

export default function CharacterTokenNumber({character, quantity, ...props}: Props) {
  if (quantity === 0) {
    return null
  }
  return (
    <div {...props}>
      <CharacterToken css={tokenStyle} character={character}/>
      <div css={tokenQuantityStyle}>{quantity}</div>
    </div>
  )
}

const tokenStyle = css`
  position: relative;
  width: 100%;
  height: auto;
`

const tokenQuantityStyle = css`
  position: absolute;
  bottom: -20%;
  right: 0;
  font-size: 2.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
`