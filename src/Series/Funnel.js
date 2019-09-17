import React, { memo, useCallback } from 'react';
import { Rect } from 'calvin-svg';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';

import Area from '../Figures/Area';
import Serie from '../Serie';
import Scale from '../Scale';

const mirror = memoize(
  (data = [], offset, height) => {
    return data.map(([x, rawY]) => {
      const h0 = height / 2;
      const h1 = h0 - offset;
      const y0 = rawY / 2;
      const y1 = (h1 / h0) * y0 + offset;

      return [x, y1, -y1];
    });
  },
  (...argv) => JSON.stringify(argv),
);

export const Funnel = ({
  color = randomColor(),
  curve = 'monotone-x',
  data: raw = [],
  delay = 0,
  duration = 3000,
  tooltip: transform = (x, y) => y,
  ...props
}) => {
  const steps = new Array(raw.length).fill(0).map((ignore, index) => index);
  const target = raw[0] || 1;

  const handleOver = useCallback(
    ({ shape }, index, onOver) => {
      const { height, width, x, y } = shape;

      onOver({ color, index, transform, x: x + width / 2, y: y + height / 2 });
    },
    [color, transform],
  );

  const handleTarget = memoize((index, onOver) => (...argv) => {
    handleOver(...argv, index, onOver);
  });

  const children = useCallback(
    memoize(
      ({ data, height, onOut, onOver, width }) => {
        const areas = steps.length - 1;
        const offset = height * 0.0125; // 2.5% of the height
        const mirrored = mirror(data, offset, height);

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
            {new Array(areas).fill(0).map((ignore, area) => {
              const key = `hover:${area}`;

              return (
                <Rect
                  color="transparent"
                  height={height}
                  key={key}
                  onBlur={onOut}
                  onFocus={handleTarget(area + 1, onOver)}
                  onMouseOut={onOut}
                  onMouseOver={handleTarget(area + 1, onOver)}
                  width={width / areas}
                  x={(width / areas) * area}
                  y={0}
                />
              );
            })}
          </>
        );
      },
      (...argv) => JSON.stringify(argv),
    ),
    [color, delay, duration],
  );

  return (
    <>
      <Scale domain={steps} name="steps" type="point" />
      <Scale domain={[0, target]} name="target" />

      <Serie
        {...props}
        data={raw.map((step, index) => [index, step])}
        scales={['steps', 'target']}
      >
        {children}
      </Serie>
    </>
  );
};

Funnel.propTypes = {
  color: PropTypes.string,
  curve: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  tooltip: PropTypes.func,
};

export default memo(Funnel);
