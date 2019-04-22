import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Shape from '../Figures/Bar';
import Serie from '../Serie';

export const Bar = ({ color, data: raw, delay, duration, ...props }) => {
  return (
    <Serie {...props} data={raw.map((value, index) => [index, value])}>
      {({ data }) =>
        data.map(([position, size], index) => (
          <Shape
            color={color}
            duration={duration / 2}
            delay={delay + ((duration / 2) * index) / (data.length - 1)}
            height={size}
            key={position}
            x={position - 4}
            y={0}
          />
        ))
      }
    </Serie>
  );
};

Bar.defaultProps = {
  color: '#222222',
  data: [],
  delay: 0,
  duration: 3000,
};

Bar.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
};

export default memo(Bar);
