import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animation, Rect } from 'calvin-svg';

function Bar({
  children,
  delay,
  duration = 500,
  ease = 'cubic-out',
  height = 0,
  opacity: defaultOpacity = 1,
  radius = 4,
  width = 8,
  x,
  ...props
}) {
  const prevHeight = useRef(0);

  useEffect(() => {
    prevHeight.current = height;
  }, [height]);

  return (
    <Rect
      height={height}
      opacity={0}
      radius={radius}
      width={width}
      x={x - width / 2}
      {...props}
    >
      <Animation
        attribute="height"
        delay={delay}
        duration={duration}
        ease={ease}
        fill="freeze"
        from={prevHeight.current}
        to={height}
      />
      <Animation
        attribute="opacity"
        delay={delay}
        duration={50}
        fill="freeze"
        from={0}
        one
        to={defaultOpacity}
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
  opacity: PropTypes.number,
  radius: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
};

export default memo(Bar);
