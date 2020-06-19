import {css, keyframes} from '@emotion/core'
import {useAnimation} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {DragPreviewImage, useDrag} from 'react-dnd'
import {characterTokenFromEmpire} from '../../drag-objects/CharacterTokenFromEmpire'
import {isCompleteConstruction} from '../../moves/CompleteConstruction'
import Move from '../../moves/Move'
import {isProduce} from '../../moves/Produce'
import {isReceiveCharacter} from '../../moves/ReceiveCharacter'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {
  areasX, boardHeight, boardTop, boardWidth, cardHeight, cardWidth, charactersPilesY, constructedCardLeftMargin, constructedCardY, developmentCardVerticalShift,
  financiersPileX, generalsPileX, tokenHeight, tokenWidth
} from '../../util/Styles'
import {circleCharacterTopPosition, getCircleCharacterLeftPosition} from '../board/ResourceArea'
import Resource from '../resources/Resource'
import Character from './Character'
import CharacterToken, {images as characterTokenImages} from './CharacterToken'

type Props = {
  player: Player | PlayerView
  character: Character
  quantity: number
  draggable?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const maxDisplayedTokens = 5

const CharacterTokenPile: FunctionComponent<Props> = ({player, character, quantity, draggable = false, ...props}) => {
  const animation = useAnimation<Move>(animation => isReceiveCharacter(animation.move) && animation.move.character === character
    && animation.move.playerId === player.empire)
  const [, ref, preview] = useDrag({
    item: characterTokenFromEmpire(character),
    canDrag: quantity > 0,
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  const tokens = []
  const tokensToDisplay = Math.min(quantity, maxDisplayedTokens)
  if (tokensToDisplay === 0){
      tokens.push(<CharacterToken key={-1} dummy={true} character={character} css={tokenStyle(0)}/>)
  }else
  {
    for (let i = 0; i < tokensToDisplay; i++) {
      tokens.push(<CharacterToken key={i} character={character} css={tokenStyle(i)}/>)
    }
  }
  if (animation) {
    if (animation.action.consequences.some(isCompleteConstruction)) {
      tokens.push(<CharacterToken key={quantity} character={character} css={[tokenStyle(Math.min(quantity + 1, maxDisplayedTokens - 1)),
        animateFromConstructedCard(character, player.constructedDevelopments.length - 1, animation.duration)]}/>)
    } else {
      const produce = animation.action.consequences.find(isProduce)
      const productionBonusOrigin = produce?.resource || Resource.Science
      tokens.push(<CharacterToken key={quantity} character={character} css={[tokenStyle(Math.min(quantity + 1, maxDisplayedTokens - 1)),
        animateFromBoard(character, productionBonusOrigin, animation.duration)]}/>)
    }
  }
  return (
    <div ref={ref} {...props}>
      {tokens}
      <div css={tokenQuantityStyle}>{quantity}</div>
      <DragPreviewImage connect={preview} src={characterTokenImages[character]} css={characterTokenDraggingStyle}/>
    </div>
  )
}

const tokenStyle = (index: number) => css`
  position: absolute;
  width: 100%;
  transform: translate(${(index * 3)}%, ${(index * 5)}%);
`

const animateFromConstructedCard = (character: Character, index: number, duration: number) => {
  const pileX = character === Character.Financier ? financiersPileX : generalsPileX
  const x = (constructedCardLeftMargin + cardWidth / 2 - pileX) * 100 / tokenWidth
  const y = (constructedCardY(index) + cardHeight - charactersPilesY - developmentCardVerticalShift * 1.8) * 100 / tokenHeight
  const keyframe = keyframes`
    from { transform: translate(${x - 50}%, ${y - 50}%)  scale(0.3); }
  `
  return css`
    animation: ${keyframe} ${duration}s ease-in-out forwards;
    z-index: 10;
  `
}

const animateFromBoard = (character: Character, resource: Resource, duration: any) => {
  const pileX = character === Character.Financier ? financiersPileX : generalsPileX
  const x = (areasX + getCircleCharacterLeftPosition(resource) * boardWidth / 100 - pileX) * 100 / tokenWidth
  const y = (boardTop + circleCharacterTopPosition * boardHeight / 100 - charactersPilesY) * 100 / tokenHeight
  const keyframe = keyframes`
    from { transform: translate(${x - 50}%, ${y - 50}%)  scale(0.4) translate(50%, 50%); }
  `
  return css`
    animation: ${keyframe} ${duration}s ease-in-out forwards;
    z-index: 10;
  `
}

const tokenQuantityStyle = css`
  position: absolute;
  font-size: 3.5vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black;
  top: 1.5vh;
  left: 0.5vh;
`

const characterTokenDraggingStyle = css`
  height: 3vh;
`

export default CharacterTokenPile