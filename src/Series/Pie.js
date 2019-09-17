import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'calvin-svg';
import randomColor from 'randomcolor';

import Arc from '../Figures/Arc';
import Scale from '../Scale';
import Serie from '../Serie';
import { memoize } from '../utils';

export const Pie = ({
  data: raw = [],
  colors = new Array(raw.length).fill(0).map(() => randomColor()),
  cornerRadius = 4,
  delay = 0,
  duration = 3000,
  padAngle = 3,
  thickness = 8,
  tooltip: transform = v => v,
  ...props
}) => {
  const MAX = 360;
  const OFFSET = 180;

  const total = raw.reduce((acc, slice) => acc + slice, 0);

  const handleOver = useCallback(
    ({ shape }, index, onOver, width, height) => {
      const [x, y] = shape.centroid;

      onOver({
        color: colors[index],
        index,
        transform,
        x: -x + width / 2,
        y: y + height / 2,
      });
    },
    [colors, transform],
  );

  const handleTarget = memoize((index, onOver, width, height) => (...argv) => {
    handleOver(...argv, index, onOver, width, height);
  });

  const children = useCallback(
    memoize(
      ({ data, height, onOut, onOver, width }) => (
        <Layer transform="scale(-1, 1)" x={width}>
          {data
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
                  cornerRadius={cornerRadius * (data.length > 1)}
                  delay={delay + (duration / data.length) * index}
                  duration={duration / data.length}
                  endAngle={
                    startAngle + size - padAngle * (data.length > 1) + OFFSET
                  }
                  height={height}
                  key={`${position},${width}x${height}`}
                  onBlur={onOut}
                  onFocus={handleTarget(index, onOver, width, height)}
                  onMouseOut={onOut}
                  onMouseOver={handleTarget(index, onOver, width, height)}
                  startAngle={startAngle + OFFSET}
                  thickness={thickness}
                  width={width}
                  x={width / 2}
                  y={height / 2}
                />
              );
            })}
        </Layer>
      ),
      (...argv) => JSON.stringify(argv),
    ),
    [colors, delay, duration],
  );

  return (
    <>
      <Scale domain={[0, 1]} name="pie" />

      <Serie
        {...props}
        data={raw.map(slice => [slice / total])}
        scales={['pie']}
        ranges={[MAX]}
      >
        {children}
      </Serie>
    </>
  );
};

Pie.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  cornerRadius: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  padAngle: PropTypes.number,
  thickness: PropTypes.number,
  tooltip: PropTypes.func,
};

export default Pie;
