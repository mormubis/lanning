import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'random-color';

import Serie from '../Serie';
import Shape from '../Figures/Line';
import Point from '../Figures/Point';

export const Line = ({
  color = randomColor().hexString(),
  data: raw,
  delay,
  duration,
  ...props
}) => (
  <Serie {...props} data={raw.map((value, index) => [index, value])}>
    {({ data }) => {
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
            opacity={0.2}
            points={data}
          />
          {points.map(([x, y, index]) => (
            <Point
              color={color}
              delay={delay + ((duration / 4) * index) / (data.length - 1)}
              duration={duration / 4}
              key={x}
              x={x}
              y={y}
            />
          ))}
        </>
      );
    }}
  </Serie>
);

Line.defaultProps = {
  color: '#222222',
  data: [],
  delay: 0,
  duration: 3000,
};

Line.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
};

export default Line;
