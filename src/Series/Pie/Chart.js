import React, { memo, useCallback, useMemo } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Arc from '../../Figures/Arc';
import { memoize } from '../../utils';

const OFFSET = 180;

const Chart = ({
  delay = 0,
  domain = [],
  colors = domain.map(() => randomColor()),
  cornerRadius = 4,
  duration = 3000,
  height,
  padAngle = 3,
  onOut = () => {},
  onOver = () => {},
  onTooltip = () => {},
  range = [],
  startAngle: offset = OFFSET,
  thickness = 8,
  width,
}) => {
  const handleOver = useCallback(
    ({ shape }, index) => {
      const {
        centroid: [x, y],
      } = shape;

      onOver({
        color: colors[index],
        index,
        shape,
      });

      onTooltip({
        color: colors[index],
        index,
        x: -x + width / 2,
        y: y + height / 2,
      });
    },
    [onOver, onTooltip],
  );

  const createOverHandler = useMemo(
    () => memoize(index => (...argv) => handleOver(...argv, index)),
    [handleOver],
  );

  return (
    <Layer transform="scale(-1, 1)" x={width}>
      {range
        .map(([size]) => size)
        .reduce((acc, size) => {
          const last = acc[acc.length - 1] || [0, 0];
          const sum = last[0] + last[1];

          return [...acc, [size, sum]];
        }, [])
        .map(([size, startAngle], index) => {
          const color = colors[index % colors.length];
          // skipping linter (we do not have any other unmutable value
          const position = index;

          return (
            <Arc
              color={color}
              cornerRadius={cornerRadius * (domain.length > 1)}
              delay={delay + (duration / domain.length) * index}
              duration={duration / domain.length}
              endAngle={
                startAngle + size - padAngle * (domain.length > 1) + offset
              }
              height={height}
              key={`${position},${width}x${height}`}
              onBlur={onOut}
              onFocus={createOverHandler(index)}
              onMouseOut={onOut}
              onMouseOver={createOverHandler(index)}
              startAngle={startAngle + offset}
              thickness={thickness}
              width={width}
              x={width / 2}
              y={height / 2}
            />
          );
        })}
    </Layer>
  );
};

Chart.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  cornerRadius: PropTypes.number,
  delay: PropTypes.number,
  domain: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  duration: PropTypes.number,
  height: PropTypes.number,
  onOut: PropTypes.func,
  onOver: PropTypes.func,
  onTooltip: PropTypes.func,
  padAngle: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  startAngle: PropTypes.number,
  thickness: PropTypes.number,
  width: PropTypes.number,
};

export default memo(Chart);
