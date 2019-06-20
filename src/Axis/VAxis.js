import React, { useCallback, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';

import Axis from './Axis';
import Tick from './Tick';

const MARGIN = 12;
const THRESHOLD = 0.05;

const VAxis = ({ color, width: defaultWidth = 25, ...props }) => {
  const lastSize = useRef(0);
  const [width, setWidth] = useState(defaultWidth);

  const handleResize = node => {
    if (node) {
      const size = Math.ceil(node.getBBox().width + MARGIN);

      if (Math.abs(lastSize.current - size) > size * THRESHOLD) {
        lastSize.current = size;
        setWidth(size);
      }
    }
  };

  const children = useCallback(
    memoize(
      ({ height, position, ticks, x, y }) => {
        const isInverted = position === 'right';

        return (
          <Layer
            height={height}
            label="axis-vertical"
            ref={handleResize}
            width={width}
            x={x}
            y={y}
          >
            {ticks.map(({ label, offset, value }) => (
              <Tick
                color={color}
                key={value}
                stickTo={isInverted ? 'right' : 'left'}
                x={isInverted ? width - MARGIN / 3 : MARGIN / 3}
                y={offset}
              >
                {label}
              </Tick>
            ))}
          </Layer>
        );
      },
      (...argv) => JSON.stringify(argv),
    ),
    [color, width],
  );

  return (
    <Axis {...props} width={width}>
      {children}
    </Axis>
  );
};

VAxis.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
};

export default VAxis;
