import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {DragPreviewImage, useDrag} from 'tabletop-game-workshop'
import {characterTokenFromEmpire} from '../../drag-objects/CharacterTokenFromEmpire'
import Character from './Character'
import CharacterToken, {images as characterTokenImages} from './CharacterToken'

type Props = {
  character: Character
  quantity: number
  draggable?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const CharacterTokenPile: FunctionComponent<Props> = ({character, quantity, draggable = false, ...props}) => {
  const [{}, ref, preview] = useDrag({
    item: characterTokenFromEmpire(character),
    canDrag: quantity > 1,
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  const tokens = []
  const tokensToDisplay = Math.min(quantity, 5)
  for (let i = 0; i < tokensToDisplay; i++) {
    tokens.push(<CharacterToken key={i} character={character} css={tokenStyle(i)}/>)
  }
  return (
    <div ref={ref} {...props}>
      {tokens}
      {quantity > 5 && <div css={tokenQuantityStyle}>{quantity}</div>}
      <DragPreviewImage connect={preview} src={characterTokenImages[character]} css={characterTokenDraggingStyle}/>
    </div>
  )
}

const tokenStyle = (index: number) => css`
  position: absolute;
  width: 100%;
  left: ${index * 10}%;
  top: 0;
`

const tokenQuantityStyle = css`
  position: absolute;
  font-size: 3vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black, 0 0 3px black, 0 0 3px black;
  left: 3px;
`

const characterTokenDraggingStyle = css`
  height: 3vh;
`

export default CharacterTokenPile