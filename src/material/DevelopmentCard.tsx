import React from 'react'
import zeppelin from './zeppelin.jpg'

const cardHeight = 22

const style = {
  height: `${cardHeight}vh`,
  width: `${cardHeight * 13 / 20}vh`,
  backgroundImage: `url('${zeppelin}')`,
  backgroundSize: `cover`,
  borderRadius: `1vh`,
  boxShadow: `0 0 0.1vh white`
}

const DevelopmentCard = () => {
  return (
    <div style={style}>
      <h3 style={{display: 'none'}}>Zeppelin</h3>
    </div>
  )
}

export default DevelopmentCard