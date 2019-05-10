import React, { memo } from 'react';
import { Rect } from 'calvin-svg';
import PropTypes from 'prop-types';
import randomColor from 'random-color';
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
  color = randomColor().hexString(),
  curve = 'monotone-x',
  data: raw = [],
  delay = 0,
  duration = 3000,
  tooltip: onTooltip = v => v,
  ...props
}) => {
  const steps = Array(raw.length)
    .fill(0)
    .map((ignore, index) => index);
  const target = raw[0] || 1;

  return (
    <>
      <Scale domain={steps} name="steps" type="point" />
      <Scale domain={[0, target]} name="target" />

      <Serie
        {...props}
        data={raw.map((step, index) => [index, step])}
        scales={['steps', 'target']}
      >
        {({ data, height, tooltip, width }) => {
          const areas = steps.length - 1;
          const offset = height * 0.0125; // 2.5% of the height
          const mirrored = mirror(data, offset, height);

          const handleTarget = memoize(value => ({ shape }) => {
            const { height: areaHeight, width: areaWidth, x, y } = shape;

            return tooltip.open({
              color,
              message: onTooltip(value),
              x: x + areaWidth / 2,
              y: y + areaHeight / 2,
            });
          });

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
              {Array(areas)
                .fill(0)
                .map((ignore, area) => (
                  <Rect
                    color="transparent"
                    height={height}
                    onBlur={tooltip.close}
                    onFocus={handleTarget(raw[area + 1])}
                    onMouseOut={tooltip.close}
                    onMouseOver={handleTarget(raw[area + 1])}
                    width={width / areas}
                    x={(width / areas) * area}
                    y={0}
                  />
                ))}
            </>
          );
        }}
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
