import React, { useLayoutEffect, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';

import Text from '../Shapes/Text';

import Axis from './Axis';
import Tick from './Tick';

const MARGIN = 10;

const HAxis = ({ color, height: defaultHeight = 25, ...props }) => {
  const element = useRef(null);
  const [height, setHeight] = useState(defaultHeight);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (element.current) {
        setHeight(Math.ceil(element.current.getBBox().height + MARGIN));
      }
    });
  });

  return (
    <Axis bottom {...props} height={height}>
      {({ label, position, ticks, width, x, y }) => {
        const isInverted = position === 'top';

        return (
          <Layer
            height={height}
            label="axis-horizontal"
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
                x={width}
                y={isInverted ? MARGIN : height - MARGIN}
              >
                {label}
              </Text>
            )}
            {ticks.map(({ label: tickLabel, offset, value }) => (
              <Tick
                color={color}
                key={value}
                stickTo={isInverted ? 'bottom' : 'top'}
                x={offset}
                y={isInverted ? MARGIN : height - MARGIN}
              >
                {tickLabel}
              </Tick>
            ))}
          </Layer>
        );
      }}
    </Axis>
  );
};

HAxis.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
};

export default HAxis;
