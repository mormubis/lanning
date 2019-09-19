import React, { memo, useCallback, useMemo } from 'react';
import { Polygon } from 'calvin-svg';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Area from '../../Figures/Area';
import { memoize } from '../../utils';

const mirror = (data = [], offset = 0, height = 0) =>
  data.map(([x, rawY]) => {
    const h0 = height / 2;
    const h1 = h0 - offset;
    const y0 = rawY / 2;
    const y1 = (h1 / h0) * y0 + offset;

    return [x, y1, -y1];
  });

const Chart = ({
  color = randomColor(),
  curve = 'monotone-x',
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
  const gaps = domain.length - 1;
  const offset = height * 0.0125; // 2.5% of the height
  const mirrored = mirror(range, offset, height);

  const handleOver = useCallback(
    ({ shape }, index) => {
      const { centroid, x, y } = shape;

      onOver({
        color,
        index,
        shape,
      });

      onTooltip({ color, index, x: centroid[0] + x, y: centroid[1] + y });
    },
    [onOver, onTooltip],
  );

  const createOverHandler = useMemo(
    () => memoize(index => (...argv) => handleOver(...argv, index)),
    [handleOver],
  );

  return (
    <>
      <Area
        color={color}
        curve={curve}
        delay={delay}
        duration={duration}
        key={`${width}x${height}`}
        points={mirrored}
        x={0}
        y={height / 2}
      />
      {Array.from({ length: gaps }).map((ignore, index) => {
        const key = `hover:${index}`;
        const points = [
          [mirrored[index][0], mirrored[index][1]],
          [mirrored[index + 1][0], mirrored[index + 1][1]],
          [mirrored[index + 1][0], mirrored[index + 1][2]],
          [mirrored[index][0], mirrored[index][2]],
        ];

        return (
          <Polygon
            color="transparent"
            key={key}
            onBlur={onOut}
            onFocus={createOverHandler(index + 1)}
            onMouseOut={onOut}
            onMouseOver={createOverHandler(index + 1)}
            points={points}
            x={0}
            y={height / 2}
          />
        );
      })}
    </>
  );
};

Chart.propTypes = {
  color: PropTypes.string,
  curve: PropTypes.string,
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
