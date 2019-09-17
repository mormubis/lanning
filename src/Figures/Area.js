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

  useEffect(() => {
    prevPoints.current = points;
  }, [JSON.stringify(points)]);

  return (
    <Shape curve={curve} points={[]} {...props}>
      <Animation
        attribute="d"
        delay={delay}
        duration={duration}
        ease={ease}
        fill="freeze"
        step={percentage =>
          Shape.d({
            curve,
            points: points.map((point, index) => {
              const [x, y1, y0] = point;
              const [, prevY1, prevY0] = prevPoints.current[index];

              return [
                x,
                prevY1 + (y1 - prevY1) * percentage,
                ...(point.length > 2 && [prevY0 + (y0 - prevY0) * percentage]),
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
