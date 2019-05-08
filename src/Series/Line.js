import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'random-color';

import Serie from '../Serie';
import Shape from '../Figures/Line';
import Point from '../Figures/Point';

export const Line = ({
  color = randomColor().hexString(),
  data: raw = [],
  delay = 0,
  duration = 3000,
  tooltip: onTooltip = v => v,
  ...props
}) => (
  <Serie {...props} data={raw.map((value, index) => [index, value])}>
    {({ data, tooltip }) => {
      const points = data
        .map((value, index) => [...value, index])
        .filter(([, positionY], index) => {
          const [, previousY] = data[index - 1] || [];
          const [, nextY] = data[index + 1] || [];

          return previousY !== positionY || nextY !== positionY;
        });

      const handleTarget = value => ({ shape }) => {
        const { x, y } = shape;

        return tooltip.open({ color, message: onTooltip(value), x, y });
      };

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
              onBlur={tooltip.close}
              onFocus={handleTarget(raw[index])}
              onMouseOver={handleTarget(raw[index])}
              onMouseOut={tooltip.close}
              x={x}
              y={y}
            />
          ))}
        </>
      );
    }}
  </Serie>
);

Line.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  tooltip: PropTypes.func,
};

export default Line;
