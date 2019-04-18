import React from 'react';
import { Layer, Text } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
import Tick from './Tick';

const HAxis = props => {
  const { color, name = '', ticks: nTicks, unit = '' } = props;

  const { width, x, y } = useLayout(props);
  const scale = useScale({ ...props, size: width });

  if (!scale) {
    return null;
  }

  const ticks = scale.ticks(nTicks);

  return (
    <Layer x={x} y={y}>
      <Text>{`${name}${unit ? `(${unit})` : ''}`}</Text>
      {ticks.map(tick => (
        <Tick color={color} key={tick} stickTo="left" x={scale(tick)} y={0}>
          {tick}
        </Tick>
      ))}
    </Layer>
  );
};

HAxis.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  ticks: PropTypes.number,
  unit: PropTypes.string,
};

export default HAxis;
