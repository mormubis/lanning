import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animation, Rect } from 'calvin-svg';

function Bar({
  children,
  delay,
  duration = 500,
  ease = 'cubic-out',
  height = 0,
  radius = 4,
  width = 8,
  ...props
}) {
  const prevHeight = useRef(0);

  useEffect(() => {
    prevHeight.current = height;
  }, [height]);

  return (
    <Rect radius={radius} width={width} {...props}>
      <Animation
        attribute="height"
        delay={delay}
        duration={duration}
        ease={ease}
        fill="freeze"
        from={prevHeight.current}
        to={height}
      />
      {children}
    </Rect>
  );
}

Bar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  delay: PropTypes.number,
  duration: PropTypes.number,
  ease: PropTypes.string,
  height: PropTypes.number,
  radius: PropTypes.number,
  width: PropTypes.number,
};

export default Bar;
