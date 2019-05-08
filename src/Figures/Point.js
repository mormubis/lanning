import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animation, Circle } from 'calvin-svg';

export const Point = ({
  children,
  color,
  delay,
  duration = 500,
  ease = 'cubic-out',
  radius = 6,
  y,
  ...props
}) => {
  const prevY = useRef(y);

  useEffect(() => {
    prevY.current = y;
  }, [y]);

  return (
    <Circle
      fill="white"
      radius={0}
      stroke={color}
      strokeWidth={(radius * 2) / 3}
      y={y}
      {...props}
    >
      <Animation
        attribute="r"
        delay={delay}
        duration={duration}
        ease="bounce-out"
        fill="freeze"
        from={0}
        to={radius}
      />
      <Animation
        attribute="cy"
        delay={delay}
        duration={duration * 2}
        ease={ease}
        fill="freeze"
        from={prevY.current}
        to={y}
      />
      {children}
    </Circle>
  );
};

Point.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.string.isRequired,
  delay: PropTypes.number,
  duration: PropTypes.number,
  ease: PropTypes.string,
  radius: PropTypes.number,
  y: PropTypes.number,
};

export default Point;
