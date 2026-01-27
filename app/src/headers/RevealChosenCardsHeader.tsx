import { HeaderText } from '@gamepark/react-game'

export const RevealChosenCardsHeader = () => {
  return (
    <HeaderText
      code="draft.reveal"
      defaults={{
        you: 'Players reveal the card they have chosen',
        player: 'Players reveal the card they have chosen',
        players: 'Players reveal the card they have chosen'
      }}
    />
  )
}
