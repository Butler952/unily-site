import React from 'react';

const Icon = (props) => {
  return (
      <svg 
        width={`${props.size}px`} 
        height={`${props.size}px`} 
        viewBox={`0 0 ${props.viewbox} ${props.viewbox}`}>
            <path d={props.icon} className={props.className}></path>
      </svg>
  )
};

Icon.defaultProps = {
  size: 24,
  viewbox: 24,
};

export default Icon;