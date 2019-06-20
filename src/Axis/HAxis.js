import React, { useCallback, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';

import Axis from './Axis';
import Tick from './Tick';

const MARGIN = 10;
const THRESHOLD = 0.05;

const HAxis = ({ color, height: defaultHeight = 25, ...props }) => {
  const lastSize = useRef(0);
  const [height, setHeight] = useState(defaultHeight);

  const handleResize = node => {
    if (node) {
      const size = Math.ceil(node.getBBox().height + MARGIN);

      if (Math.abs(lastSize.current - size) > size * THRESHOLD) {
        lastSize.current = size;
        setHeight(size);
      }
    }
  };

  const children = useCallback(
    memoize(
      ({ position, ticks, width, x, y }) => {
        const isInverted = position === 'top';

        return (
          <Layer
            height={height}
            label="axis-horizontal"
            ref={handleResize}
            width={width}
            x={x}
            y={y}
          >
            {ticks.map(({ label, offset, value }) => (
              <Tick
                color={color}
                key={value}
                stickTo={isInverted ? 'bottom' : 'top'}
                x={offset}
                y={isInverted ? MARGIN : height - MARGIN}
              >
                {label}
              </Tick>
            ))}
          </Layer>
        );
      },
      (...argv) => JSON.stringify(argv),
    ),
    [color, height],
  );

  return (
    <Axis bottom {...props} height={height}>
      {children}
    </Axis>
  );
};

HAxis.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
};

export default HAxis;
