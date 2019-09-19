import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Chart from './Chart';
import Scale from '../../Scale';
import Serie from '../../Serie';
import { memoize } from '../../utils';

export const Pie = ({
  colors,
  data: domain = [],
  cornerRadius,
  delay = 0,
  duration = 3000,
  padAngle,
  startAngle,
  thickness,
  ...props
}) => {
  const MAX = 360;

  const total = domain.reduce((acc, slice) => acc + slice, 0);

  const children = useMemo(
    () =>
      memoize(
        context => (
          <Chart
            colors={colors}
            cornerRadius={cornerRadius}
            delay={delay}
            domain={domain}
            duration={duration}
            padAngle={padAngle}
            startAngle={startAngle}
            thickness={thickness}
            {...context}
          />
        ),
        (...argv) => JSON.stringify(argv),
      ),
    [
      colors,
      cornerRadius,
      delay,
      JSON.stringify(domain),
      duration,
      padAngle,
      startAngle,
      thickness,
    ],
  );

  return (
    <>
      <Scale domain={[0, 1]} name="pie" />

      <Serie
        {...props}
        data={domain.map(slice => [slice / total])}
        scales={['pie']}
        ranges={[MAX]}
      >
        {children}
      </Serie>
    </>
  );
};

Pie.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  cornerRadius: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  padAngle: PropTypes.number,
  startAngle: PropTypes.number,
  thickness: PropTypes.number,
  tooltip: PropTypes.func,
};

export default Pie;
