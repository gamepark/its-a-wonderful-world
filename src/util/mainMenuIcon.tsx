import React, {FunctionComponent} from 'react'

type Props = React.HTMLAttributes<HTMLButtonElement> & { up: boolean }

const MainMenuIcon: FunctionComponent<Props> = ({up}) => {
  if(up)
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
      </svg>
    )
    else
      return(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
    </svg>
    )
}

export default MainMenuIcon