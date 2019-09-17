import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Serie from '../Serie';
import Shape from '../Figures/Line';
import Point from '../Figures/Point';
import { memoize } from '../utils';

export const Line = ({
  color = randomColor(),
  data: raw = [],
  delay = 0,
  duration = 3000,
  tooltip: transform = (x, y) => y,
  ...props
}) => {
  const handleOver = useCallback(
    ({ shape }, index, onOver) => {
      const { x, y } = shape;

      onOver({ color, index, transform, x, y });
    },
    [color, transform],
  );

  const handleTarget = memoize((index, onOver) => (...argv) => {
    handleOver(...argv, index, onOver);
  });

  const children = useCallback(
    memoize(
      ({ data, height, onOut, onOver, width }) => {
        const points = data
          .map((value, index) => [...value, index])
          .filter(([, positionY], index) => {
            const [, previousY] = data[index - 1] || [];
            const [, nextY] = data[index + 1] || [];

            return previousY !== positionY || nextY !== positionY;
          });

        return (
          <>
            <Shape
              color={color}
              delay={delay}
              duration={duration / 2}
              key={`${width}x${height}`}
              opacity={0.2}
              points={data}
            />
            {points.map(([x, y, index]) => (
              <Point
                color={color}
                delay={delay + ((duration / 4) * index) / (data.length - 1)}
                duration={duration / 4}
                key={`${x},${width}x${height}`}
                onBlur={onOut}
                onFocus={handleTarget(index, onOver)}
                onMouseOut={onOut}
                onMouseOver={handleTarget(index, onOver)}
                x={x}
                y={y}
              />
            ))}
          </>
        );
      },
      (...argv) => JSON.stringify(argv),
    ),
    [color, delay, duration],
  );

  return (
    <Serie {...props} data={raw.map((value, index) => [index, value])}>
      {children}
    </Serie>
  );
};

Line.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  tooltip: PropTypes.func,
};

export default Line;
