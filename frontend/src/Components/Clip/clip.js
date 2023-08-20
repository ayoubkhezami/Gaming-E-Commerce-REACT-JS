import React from 'react'

export default function Clip(props) {
   
  return (
    <div className="item">
    <div className="thumb">
      <img src="assets/images/clip-01.jpg" alt style={{borderRadius: 23}} />
      <a href="https://www.youtube.com/watch?v=r1b03uKWk_M" target="_blank"><i className="fa fa-play" /></a>
    </div>
    <div className="down-content">
     {
        props.product.title.length > 15 ? 
        <h6>{props.product.title.slice(0,15)} ...</h6> :
         <h6>{props.product.title}</h6>
     }
      <span><i className="fa fa-eye" /> 250</span>
    </div>
  </div>
  )
}
