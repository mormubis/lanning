import React, { useLayoutEffect, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';

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

  return (
    <Axis {...props} width={width}>
      {({ height, label, position, ticks, x, y }) => {
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
                stickTo={isInverted ? 'bottom' : 'top'}
                x={isInverted ? MARGIN : width - MARGIN}
                y={offset}
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

VAxis.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
};

export default VAxis;
