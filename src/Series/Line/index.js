import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import Chart from './Chart';
import Serie from '../../Serie';
import { memoize } from '../../utils';

export const Line = ({
  color = randomColor(),
  data: domain = [],
  delay = 0,
  duration = 3000,
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
    [color, delay, duration],
  );

  return (
    <Serie {...props} data={domain.map((value, index) => [index, value])}>
      {children}
    </Serie>
  );
};

Line.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  tooltip: PropTypes.func,
};

export default Line;
