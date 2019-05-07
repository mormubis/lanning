import React from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'calvin-svg';

import Arc from '../Figures/Arc';
import Scale from '../Scale';
import Serie from '../Serie';

export const Pie = ({
  colors = ['#222222'],
  data: raw = [],
  delay = 0,
  duration = 3000,
  padAngle = 3,
  radius = 4,
  thickness = 8,
  ...props
}) => {
  const MAX = 360;
  const OFFSET = 180;

  const total = raw.reduce((acc, slice) => acc + slice, 0);

  return (
    <>
      <Scale domain={[0, 1]} name="pie" />

      <Serie
        {...props}
        data={raw.map(slice => [slice / total])}
        scales={['pie']}
        ranges={[MAX]}
      >
        {({ data, height, width }) => (
          <Layer transform="scale(-1, 1)" x={width}>
            {data
              .map(([size]) => size)
              .reduce((acc, size) => {
                const last = acc[acc.length - 1] || [0, 0];
                const sum = last[0] + last[1];

                return [...acc, [size, sum]];
              }, [])
              .map(([size, startAngle], index) => {
                // skipping linter (we do not have any other unmutable value
                const position = index;

                return (
                  <Arc
                    color={colors[index % colors.length]}
                    delay={delay + (duration / data.length) * index}
                    duration={duration / data.length}
                    endAngle={startAngle + size - padAngle + OFFSET}
                    height={height}
                    key={position}
                    radius={radius}
                    startAngle={startAngle + OFFSET}
                    thickness={thickness}
                    width={width}
                    x={width / 2}
                    y={height / 2}
                  />
                );
              })}
          </Layer>
        )}
      </Serie>
    </>
  );
};

Pie.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  padAngle: PropTypes.number,
  radius: PropTypes.number,
  thickness: PropTypes.number,
};

export default Pie;
