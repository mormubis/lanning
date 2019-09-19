import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Line from '../../Figures/Line';
import Point from '../../Figures/Point';
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
  // Points of Interest
  const poi = range
    .map((value, index) => [...value, index])
    .filter(([, positionY], index) => {
      const [, previousY] = range[index - 1] || [];
      const [, nextY] = range[index + 1] || [];

      return previousY !== positionY || nextY !== positionY;
    });

  const handleOver = useCallback(
    ({ shape }, index) => {
      const { x, y } = shape;

      onOver({
        color,
        index,
        shape,
      });

      onTooltip({ color, index, x, y });
    },
    [JSON.stringify(domain)],
  );

  const createOverHandler = useMemo(
    () => memoize(index => (...argv) => handleOver(...argv, index)),
    [handleOver],
  );

  return (
    <>
      <Line
        color={color}
        delay={delay}
        duration={duration / 2}
        key={`${width}x${height}`}
        opacity={0.2}
        points={range}
      />
      {poi.map(([x, y, index]) => (
        <Point
          color={color}
          delay={delay + ((duration / 4) * index) / (domain.length - 1)}
          duration={duration / 4}
          key={`${x},${width}x${height}`}
          onBlur={onOut}
          onFocus={createOverHandler(index)}
          onMouseOut={onOut}
          onMouseOver={createOverHandler(index)}
          x={x}
          y={y}
        />
      ))}
    </>
  );
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
