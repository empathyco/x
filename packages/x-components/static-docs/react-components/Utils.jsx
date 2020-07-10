import React from 'react';
import '../css/utils/utils.scss';

export const Highlight = ({ children, color }) => (
  <span
    style={ {
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem'
    } }>
    { children }
  </span>
);

export const Table = ({ children }) => (
  <div>
    { [...children] }
  </div>
);

export const NextItem = ({ children, color, next, font }) => {
  return <a className="next-item"
            href={ next }
            style={ {
              backgroundColor: color,
              color: font
            } }>
    <img className="next-item__image" src={ 'https://cdn.onlinewebfonts.com/svg/img_16651.png' }/>
    <span className="next-item__text">{ children }</span>
    <img className="next-item__arrow" src={'https://image.flaticon.com/icons/svg/748/748073.svg'}/>
  </a>;
};

