import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Animation, Line as Shape } from 'calvin-svg';

const Line = ({
  children,
  curve,
  delay,
  duration = 3000,
  ease = 'cubic-out',
  opacity = 1,
  points,
  thickness = 3,
  ...props
}) => {
  const element = useRef(null);
  const prevPoints = useRef(points);
  const [length, setLength] = useState(0);
  const hash = JSON.stringify(points);

  useEffect(() => {
    prevPoints.current = points;
  }, [hash]);

  useLayoutEffect(() => {
    setLength(element.current.getTotalLength());
  }, []);

  return (
    <Shape
      ref={element}
      strokeDasharray={length}
      points={points}
      {...props}
      opacity={length === 0 ? 0 : opacity}
      thickness={thickness}
    >
      <Animation
        attribute="stroke-dashoffset"
        duration={duration}
        ease={ease}
        from={length}
        strokeLinecap="round"
        strokeLinejoin="round"
        to={0}
      />
      <Animation
        attribute="d"
        delay={delay}
        duration={duration}
        ease={ease}
        step={percentage =>
          Shape.d({
            curve,
            points: points.map(
              (value, index) =>
                prevPoints.current[index] +
                (value - prevPoints.current[index]) * percentage,
            ),
          })
        }
      />
      {children}
    </Shape>
  );
};

Line.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  curve: PropTypes.string,
  delay: PropTypes.number,
  duration: PropTypes.number,
  ease: PropTypes.string,
  opacity: PropTypes.number,
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  thickness: PropTypes.number,
};

export default Line;
