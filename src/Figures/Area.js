import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animation, Area as Shape } from 'calvin-svg';

const Area = ({
  children,
  curve,
  delay = 0,
  duration = 3000,
  ease = 'cubic-out',
  points,
  ...props
}) => {
  const prevPoints = useRef(points.map(([x]) => [x, 0, 0]));
  const hash = JSON.stringify(points);

  useEffect(() => {
    prevPoints.current = points;
  }, [hash]);

  return (
    <Shape curve={curve} {...props}>
      <Animation
        attribute="d"
        delay={delay}
        duration={duration}
        ease={ease}
        fill="freeze"
        step={percentage =>
          Shape.d({
            curve,
            points: points.map(([x, y1, y0], index) => {
              const [, prevY1, prevY0] = prevPoints.current[index];

              return [
                x,
                prevY1 + (y1 - prevY1) * percentage,
                ...(y0 && [(y0 - prevY0) * percentage]),
              ];
            }),
          })
        }
      />
      {children}
    </Shape>
  );
};

Area.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  curve: PropTypes.string,
  delay: PropTypes.number,
  duration: PropTypes.number,
  ease: PropTypes.string,
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

export default memo(Area);
