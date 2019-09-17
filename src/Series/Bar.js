import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Shape from '../Figures/Bar';
import Serie from '../Serie';
import { memoize } from '../utils';

export const Bar = ({
  color = randomColor(),
  data: raw = [],
  delay = 0,
  duration = 3000,
  tooltip: transform = (x, y) => y,
  ...props
}) => {
  const handleOver = useCallback(
    ({ shape }, index, onOver) => {
      const [x, y] = shape.centroid;

      onOver({ color, index, transform, x, y });
    },
    [color, transform],
  );

  const handleTarget = memoize((index, onOver) => (...argv) => {
    handleOver(...argv, index, onOver);
  });

  const children = useCallback(
    memoize(
      ({ data, height, onOver, onOut, width }) =>
        data.map(([position, size], index) => (
          <Shape
            color={color}
            delay={delay + ((duration / 2) * index) / (data.length - 1)}
            duration={duration / 2}
            height={size}
            key={`${position},${width}x${height}`}
            onBlur={onOut}
            onFocus={handleTarget(index, onOver)}
            onMouseOut={onOut}
            onMouseOver={handleTarget(index, onOver)}
            x={position}
            y={0}
          />
        )),
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

Bar.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  tooltip: PropTypes.func,
};

export default memo(Bar);
