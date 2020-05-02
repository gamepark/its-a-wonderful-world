import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Player, PlayerView} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio, width as cardWidth} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import screenRatio from '../util/screenRatio'

const empireCardHorizontalShift = 0.44
const empireCardVerticalShift = 0.9
const developmentCardVerticalShift = 0.12
export const constructedCardLeftMargin = cardHeight * empireCardHorizontalShift / screenRatio - 5

const ConstructedCardsArea: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => {
  const style = (index: number) => css`
      position:absolute;
      width: ${cardWidth}%;
      height: ${cardHeight}%;
      transform: translateY(-${index * developmentCardVerticalShift * 100}%);
      bottom: ${2 + cardHeight * cardRatio * empireCardVerticalShift}%;
      left: ${1 + constructedCardLeftMargin}%;
    `
  return (
    <Fragment>
      {player.constructedDevelopments.map((card, index) => <DevelopmentCard key={card} development={developmentCards[card]} css={style(index)}/>)}
    </Fragment>
  )
}

export default ConstructedCardsArea