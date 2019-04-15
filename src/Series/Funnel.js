import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Area from '../Figures/Area';
import Serie from '../Serie';

export const Funnel = ({
  color,
  curve,
  data: raw,
  delay,
  duration,
  height,
  ...props
}) => {
  const offset = height * 0.025; // 2.5% of the height

  return (
    <Serie height={height / 2} {...props}>
      {({ data }) => (
        <>
          <Area
            color={color}
            curve={curve}
            points={data.map(([x, y]) => [x, y + offset])}
          />
          <Area
            color={color}
            curve={curve}
            points={data.map(([x, y]) => [x, -y - offset])}
          />
        </>
      )}
    </Serie>
  );
};

Funnel.defaultProps = {
  color: '#222222',
  curve: 'curveMonotoneX',
  data: [],
  delay: 0,
  duration: 3000,
  height: 0,
};

Funnel.propTypes = {
  color: PropTypes.string,
  curve: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  height: PropTypes.number,
};

export default memo(Funnel);
