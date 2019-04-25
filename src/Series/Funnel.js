import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Area from '../Figures/Area';
import Serie from '../Serie';
import Scale from '../Scale';

export const Funnel = ({
  color = '#222222',
  curve = 'monotone-x',
  data: raw = [],
  delay = 0,
  duration = 3000,
  ...props
}) => {
  const steps = Array(raw.length)
    .fill(0)
    .map((ignore, index) => index);
  const target = raw[0];

  return (
    <>
      <Scale domain={steps} name="steps" type="point" />
      <Scale domain={[0, target]} name="target" />

      <Serie
        {...props}
        data={raw.map((step, index) => [index, step])}
        scales={['steps', 'target']}
      >
        {({ data, height }) => {
          const offset = height * 0.0125; // 2.5% of the height

          return (
            <Area
              color={color}
              curve={curve}
              delay={delay}
              duration={duration}
              points={data.map(([x, rawY]) => {
                const h0 = height / 2;
                const h1 = h0 - offset;
                const y0 = rawY / 2;
                const y1 = (h1 / h0) * y0 + offset;

                return [x, y1, -y1];
              })}
              x={0}
              y={height / 2}
            />
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
};

export default memo(Funnel);
