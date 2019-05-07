import React, { useMemo, useLayoutEffect, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
import Scale from '../Scale';
import Scales from '../Scales';
import Text from '../Shapes/Text';

import { useDomain } from './Axis';
import Tick from './Tick';

const OFFSET = 18;

const usePosition = ({ left, right }) => {
  return useMemo(() => {
    switch (true) {
      case right:
        return 'right';
      case left:
      default:
        return 'left';
    }
  }, [left, right]);
};

const VAxis = ({
  color,
  label,
  name,
  ticks: nTicks,
  type,
  unit = '',
  width: defaultWidth = 25,
  ...rest
}) => {
  const domain = useDomain(rest);
  const element = useRef(null);
  const position = usePosition(rest);

  const [width, setWidth] = useState(defaultWidth);

  const { height, x, y } = useLayout({
    name,
    position,
    width,
    ...rest,
  });

  const scale = useScale({ name, range: height });

  useLayoutEffect(() => {
    if (element.current) {
      setWidth(element.current.getBBox().width + OFFSET);
    }
  });

  if (!scale) {
    return (
      <Scale
        domain={domain}
        key={name}
        name={name}
        ticks={nTicks}
        type={type}
      />
    );
  }

  const ticks = scale.ticks ? scale.ticks(nTicks) : scale.domain();

  const isInverted = position === 'right';

  return (
    <>
      <Scale
        domain={domain}
        key={name}
        name={name}
        ticks={nTicks}
        type={type}
      />
      <Layer height={height} ref={element} width={width} x={x} y={y}>
        {(label || unit) && (
          <Text
            color={color}
            textAlign={isInverted ? 'left' : 'right'}
            x={isInverted ? OFFSET : width - OFFSET}
            y={height + OFFSET}
          >{`${label}${unit ? `(${unit})` : ''}`}</Text>
        )}
        {ticks.map(tick => (
          <Tick
            color={color}
            key={tick}
            stickTo={isInverted ? 'left' : 'right'}
            x={isInverted ? OFFSET : width - OFFSET}
            y={scale(tick)}
          >
            {tick}
          </Tick>
        ))}
      </Layer>
    </>
  );
};

VAxis.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  ticks: PropTypes.number,
  unit: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(Scales)),
  width: PropTypes.number,
};

export default VAxis;
