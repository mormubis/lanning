import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Bar from '../../Figures/Bar';
import { memoize } from '../../utils';

const Chart = ({
  color = randomColor(),
  delay = 0,
  domain = [],
  duration = 3000,
  height,
  onOut = () => {},
  onOver = () => {},
  onTooltip = () => {},
  range = [],
  width,
}) => {
  const handleOver = useCallback(
    ({ shape }, index) => {
      const {
        centroid: [x, y],
      } = shape;

      onOver({
        color,
        index,
        shape,
      });

      onTooltip({ color, index, x, y });
    },
    [onOver, onTooltip],
  );

  const createOverHandler = useMemo(
    () => memoize(index => (...argv) => handleOver(...argv, index)),
    [handleOver],
  );

  return range.map(([position, size], index) => (
    <Bar
      color={color}
      delay={delay + ((duration / 2) * index) / (domain.length - 1)}
      duration={duration / 2}
      height={size}
      key={`${position},${width}x${height}`}
      onBlur={onOut}
      onFocus={createOverHandler(index)}
      onMouseOut={onOut}
      onMouseOver={createOverHandler(index)}
      x={position}
      y={0}
    />
  ));
};

Chart.propTypes = {
  color: PropTypes.string,
  delay: PropTypes.number,
  domain: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  duration: PropTypes.number,
  height: PropTypes.number,
  onOut: PropTypes.func,
  onOver: PropTypes.func,
  onTooltip: PropTypes.func,
  range: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  width: PropTypes.number,
};

export default memo(Chart);
