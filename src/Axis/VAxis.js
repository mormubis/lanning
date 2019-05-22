import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';

import Text from '../Shapes/Text';

import Axis from './Axis';
import Tick from './Tick';

const MARGIN = 18;

const VAxis = ({ color, width: defaultWidth = 25, ...props }) => {
  const element = useRef(null);
  const [width, setWidth] = useState(defaultWidth);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (element.current) {
        setWidth(Math.ceil(element.current.getBBox().width + MARGIN));
      }
    });
  });

  const children = useCallback(
    memoize(
      ({ height, label, position, ticks, x, y }) => {
        const isInverted = position === 'right';

        return (
          <Layer
            height={height}
            label="axis-vertical"
            ref={element}
            width={width}
            x={x}
            y={y}
          >
            {label && (
              <Text
                color={color}
                textAlign="right"
                verticalAlign="baseline"
                x={isInverted ? MARGIN : width - MARGIN}
                y={height + MARGIN}
              >
                {label}
              </Text>
            )}
            {ticks.map(({ label: tickLabel, offset, value }) => (
              <Tick
                color={color}
                key={value}
                stickTo={isInverted ? 'left' : 'right'}
                x={isInverted ? MARGIN : width - MARGIN}
                y={offset}
              >
                {tickLabel}
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
