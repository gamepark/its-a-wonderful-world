import {css} from '@emotion/core'
import {usePlay} from '@interlude-games/workshop'
import React, {Fragment, FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentFromConstructionArea from '../drag-objects/DevelopmentFromConstructionArea'
import DragObjectType from '../drag-objects/DragObjectType'
import {isPlayer, Player, PlayerView} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio, width as cardWidth} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import Move from '../moves/Move'
import {canBuild, getMovesToBuild} from '../Rules'
import screenRatio from '../util/screenRatio'

const empireCardHorizontalShift = 0.44
const empireCardVerticalShift = 0.9
const developmentCardVerticalShift = 2.5
export const constructedCardLeftMargin = cardHeight * empireCardHorizontalShift / screenRatio - 5

const ConstructedCardsArea: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => {
  const {t} = useTranslation()
  const play = usePlay<Move>()
  const [{dragging, isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA,
    canDrop: (item: DevelopmentFromConstructionArea) => isPlayer(player) && canBuild(player, item.card),
    collect: (monitor) => ({
      dragging: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA,
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA && isPlayer(player) && canBuild(player, monitor.getItem().card),
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromConstructionArea) => getMovesToBuild(player as Player, item.card).forEach(move => play(move))
  })
  return (
    <Fragment>
      {player.constructedDevelopments.map((card, index) => <DevelopmentCard key={card} development={developmentCards[card]}
                                                                            css={[style, bottomPosition(index)]}/>)}
      <div ref={ref} css={[buildDropArea, !dragging && hidden, isValidTarget ? validDropAreaColor(isOver) : invalidDropAreaColor]}>
        <span css={[dropAreaText, isValidTarget ? validDropTextColor : invalidDropTextColor]}>
          {isValidTarget ? t('Construire') : t('Construction impossible')}
        </span>
      </div>
    </Fragment>
  )
}

const style = css`
  position:absolute;
  width: ${cardWidth}%;
  height: ${cardHeight}%;
  bottom: ${2 + cardHeight * cardRatio * empireCardVerticalShift}%;
  left: ${1 + constructedCardLeftMargin}%;
`

const bottomPosition = (index: number) => css`
  bottom: ${2 + cardHeight * cardRatio * empireCardVerticalShift + index * developmentCardVerticalShift}%;
`

const buildDropArea = css`
  position: absolute;
  left: ${1 + constructedCardLeftMargin}%;
  width: ${cardWidth}%;
  top: 8%;
  bottom: ${2 + cardHeight * cardRatio * empireCardVerticalShift}%;
  border-radius: 1vh;
`

const hidden = css`
  display: none;
`

const validDropAreaColor = (isOver: boolean) => css`
  background-color: rgba(0, 255, 0, ${isOver ? 0.5 : 0.3});
  border: 0.3vh dashed green;
`

const invalidDropAreaColor = css`
  background-color: rgba(255, 0, 0, 0.3);
  border: 0.3vh dashed red;
`

const dropAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  text-align: center;
  font-size: 2.5vh;
`

const validDropTextColor = css`
  color: darkgreen;
`

const invalidDropTextColor = css`
  color: red;
`

export default ConstructedCardsArea