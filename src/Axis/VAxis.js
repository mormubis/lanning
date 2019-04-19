import React, { useMemo } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
import Scale from '../Scale';
import Scales from '../Scales';
import Text from '../Shapes/Text';

import { useDomain } from './Axis';
import Tick from './Tick';

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
  name,
  ticks: nTicks,
  type,
  unit = '',
  width = 25,
  ...rest
}) => {
  const domain = useDomain(rest);
  const position = usePosition(rest);

  const { height, x, y } = useLayout({ name, position, width, ...rest });

  const scale = useScale({ name, range: height });

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

  return (
    <>
      <Scale
        domain={domain}
        key={name}
        name={name}
        ticks={nTicks}
        type={type}
      />
      <Layer x={x} y={y}>
        <Text>{`${name}${unit ? `(${unit})` : ''}`}</Text>
        {ticks.map(tick => (
          <Tick color={color} key={tick} stickTo="left" x={0} y={scale(tick)}>
            {tick}
          </Tick>
        ))}
      </Layer>
    </>
  );
};

VAxis.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
  ticks: PropTypes.number,
  unit: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(Scales)),
  width: PropTypes.number,
};

export default VAxis;
