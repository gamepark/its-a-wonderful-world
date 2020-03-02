import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio} from '../material/developments/DevelopmentCard'
import screenRatio from '../util/screenRatio'

const empireCardHorizontalShift = 0.44
const empireCardVerticalShift = 0.9
const developmentCardVerticalShift = 0.12
export const constructedCardLeftMargin = cardHeight * empireCardHorizontalShift / screenRatio - 5

const ConstructedCardsArea: FunctionComponent<{ player: Player }> = ({player}) => {
  const style = (index: number) => css`
      position:absolute;
      height: ${cardHeight}%;
      transform: translateY(-${index * developmentCardVerticalShift * 100}%);
      bottom: ${2 + cardHeight * cardRatio * empireCardVerticalShift}%;
      left: ${1 + constructedCardLeftMargin}%;
    `
  return (
    <Fragment>
      {player.constructedDevelopments.map((development, index) => <DevelopmentCard key={index} development={development} css={style(index)}/>)}
    </Fragment>
  )
}

export default ConstructedCardsArea