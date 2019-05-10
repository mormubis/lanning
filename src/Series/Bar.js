import React, { memo } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'random-color';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';

import Shape from '../Figures/Bar';
import Serie from '../Serie';

export const Bar = ({
  color = randomColor().hexString(),
  data: raw = [],
  delay = 0,
  duration = 3000,
  tooltip: onTooltip = v => v,
  ...props
}) => {
  const handleTarget = memoize((tooltip, value) => ({ shape }) => {
    const [x, y] = shape.centroid;

    return tooltip.open({ color, message: onTooltip(value), x, y });
  });

  return (
    <Serie {...props} data={raw.map((value, index) => [index, value])}>
      {({ data, height, tooltip, width }) => {
        return data.map(([position, size], index) => (
          <Shape
            color={color}
            delay={delay + ((duration / 2) * index) / (data.length - 1)}
            duration={duration / 2}
            height={size}
            key={`${position},${width}x${height}`}
            onBlur={tooltip.close}
            onFocus={handleTarget(tooltip, raw[index])}
            onMouseOut={tooltip.close}
            onMouseOver={handleTarget(tooltip, raw[index])}
            x={position - 4}
            y={0}
          />
        ));
      }}
    </Serie>
  );
};

Bar.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  tooltip: PropTypes.func,
};

export default memo(Bar);
