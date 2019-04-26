import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
import Scale from '../Scale';
import Scales from '../Scales';
import Text from '../Shapes/Text';

import { useDomain } from './Axis';
import Tick from './Tick';

const OFFSET = 10;

const usePosition = ({ bottom, top }) => {
  return useMemo(() => {
    switch (true) {
      case top:
        return 'top';
      case bottom:
      default:
        return 'bottom';
    }
  }, [bottom, top]);
};
const HAxis = ({
  color,
  height: defaultHeight = 25,
  name,
  ticks: nTicks,
  type,
  unit = '',
  ...rest
}) => {
  const domain = useDomain(rest);
  const element = useRef(null);
  const position = usePosition(rest);

  const [height, setHeight] = useState(defaultHeight);

  const { width, x, y } = useLayout({ name, position, height, ...rest });

  const scale = useScale({ name, range: width });

  useLayoutEffect(() => {
    if (element.current) {
      setHeight(element.current.getBBox().height + OFFSET);
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

  const isInverted = position === 'top';

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
        <Text
          color={color}
          textAlign="right"
          verticalAlign="baseline"
          x={width}
          y={isInverted ? OFFSET : height - OFFSET}
        >{`${name}${unit ? `(${unit})` : ''}`}</Text>
        {ticks.map(tick => (
          <Tick
            color={color}
            key={tick}
            stickTo={isInverted ? 'bottom' : 'top'}
            x={scale(tick)}
            y={isInverted ? OFFSET : height - OFFSET}
          >
            {tick}
          </Tick>
        ))}
      </Layer>
    </>
  );
};

HAxis.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  name: PropTypes.string,
  scale: PropTypes.string,
  ticks: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(Scales)),
  unit: PropTypes.string,
};

export default HAxis;
