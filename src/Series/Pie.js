import React from 'react';
import PropTypes from 'prop-types';

import Arc from '../Figures/Arc';
import Scales from '../Scales';
import Serie from '../Serie';

export const Pie = ({
  color,
  data: raw,
  delay,
  duration,
  height,
  padAngle,
  width,
  ...props
}) => {
  const scale = Scales.linear();
  const MAX = Math.PI * 2;
  const OFFSET = Math.PI / 2;

  return (
    <Serie {...props} scales={[scale]} sizes={[MAX]}>
      {data =>
        data.map(([startAngle], index) => {
          const size = (data[index + 1] || MAX) - startAngle;

          return (
            <Arc
              delay={(duration / data.length) * index}
              duration={duration / data.length}
              endAngle={startAngle + size - padAngle + OFFSET}
              height={height}
              startAngle={startAngle + OFFSET}
              width={width}
            />
          );
        })
      }
    </Serie>
  );
};

Pie.defaultProps = {
  color: '#222222',
  data: [],
  delay: 0,
  duration: 3000,
  height: 0,
  padAngle: 0,
  width: 0,
};

Pie.propTypes = {
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  delay: PropTypes.number,
  duration: PropTypes.number,
  height: PropTypes.number,
  padAngle: PropTypes.number,
  width: PropTypes.number,
};

export default Pie;
