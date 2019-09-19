import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import Serie from '../../Serie';
import { memoize } from '../../utils';
import Chart from './Chart';

export const Bar = ({
  color,
  data: domain = [],
  delay,
  duration,
  ...props
}) => {
  const children = useMemo(
    () =>
      memoize(
        context => (
          <Chart
            color={color}
            delay={delay}
            domain={domain}
            duration={duration}
            {...context}
          />
        ),
        (...argv) => JSON.stringify(argv),
      ),
    [color, delay, JSON.stringify(domain), duration],
  );

  return (
    <Serie {...props} data={domain.map((value, index) => [index, value])}>
      {children}
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
