import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  size,
  text,
  borderRadius,
  width,
  customFunc,
}) => {
  const { setIsClicked, initialState } = useStateContext();

  const handleClick = () => {
    // Reset click state
    setIsClicked(initialState);
    // Invoke optional custom function (e.g. logout)
    if (customFunc) customFunc();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
