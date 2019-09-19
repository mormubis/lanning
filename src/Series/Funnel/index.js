import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import Chart from './Chart';
import Serie from '../../Serie';
import Scale from '../../Scale';
import { memoize } from '../../utils';

const Funnel = ({
  color,
  curve,
  data: domain = [],
  delay,
  duration,
  ...props
}) => {
  const steps = Array.from({ length: domain.length }, (_, index) => index);
  const target = domain[0] || 1;

  const children = useMemo(
    () =>
      memoize(
        context => (
          <Chart
            color={color}
            curve={curve}
            delay={delay}
            domain={domain}
            duration={duration}
            {...context}
          />
        ),
        (...argv) => JSON.stringify(argv),
      ),
    [color, curve, delay, JSON.stringify(domain), duration],
  );

  return (
    <>
      <Scale domain={steps} name="steps" type="point" />
      <Scale domain={[0, target]} name="target" noRound />

      <Serie
        {...props}
        data={domain.map((step, index) => [index, step])}
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
