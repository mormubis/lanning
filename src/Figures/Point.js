import React from 'react';
import PropTypes from 'prop-types';
import { Animation, Circle } from 'calvin-svg';

export const Point = ({
  children,
  color,
  delay,
  duration,
  radius,
  ...props
}) => (
  <Circle fill="white" stroke={color} strokeWidth={(radius * 2) / 3} {...props}>
    <Animation
      attribute="r"
      delay={delay}
      duration={duration}
      ease="bounce-out"
      fill="freeze"
      from={0}
      to={radius}
    />
    {children}
  </Circle>
);

Point.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.string,
  delay: PropTypes.number,
  duration: PropTypes.number,
  radius: PropTypes.number,
};

Point.defaultProps = {
  color: '#222222',
  duration: 500,
  radius: 6,
};

export default Point;
