import React, { useMemo } from 'react';
import { Layer, Text } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
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

const VAxis = props => {
  const {
    color,
    scale: scaleName,
    name = scaleName,
    ticks: nTicks,
    unit = '',
  } = props;
  const position = usePosition(props);

  const { height, x, y } = useLayout({ ...props, name, position });
  const scale = useScale({ ...props, size: height });

  if (!scale) {
    return null;
  }

  const ticks = scale.ticks ? scale.ticks(nTicks) : scale.domain();

  return (
    <Layer x={x} y={y}>
      <Text>{`${name}${unit ? `(${unit})` : ''}`}</Text>
      {ticks.map(tick => (
        <Tick color={color} key={tick} stickTo="left" x={0} y={scale(tick)}>
          {tick}
        </Tick>
      ))}
    </Layer>
  );
};

VAxis.defaultProps = {
  width: 25,
};

VAxis.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  scale: PropTypes.string,
  ticks: PropTypes.number,
  unit: PropTypes.string,
  width: PropTypes.number, // eslint-disable-line
};

export default VAxis;
