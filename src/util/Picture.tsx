import React, {FunctionComponent, ImgHTMLAttributes} from 'react'

const Picture: FunctionComponent<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const srcTest = props.src ? props.src.match(/(.*)\.(jpg|png)$/) : undefined
  return (
    <picture>
      {srcTest && <source srcSet={srcTest[1] + '.webp'}/>}
      <img alt={props.alt} {...props}/>
    </picture>
  )
}

export default Picture