import { HeaderText } from '@gamepark/react-game'

export const ChooseDevelopmentCardHeader = () => {
  return (
    <HeaderText
      code="draft"
      defaults={{
        you: 'Choose a card and place it in your draft area',
        player: '{player} must choose a development card',
        players: 'Players must choose a development card'
      }}
    />
  )
}
