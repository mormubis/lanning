import React, { useMemo } from 'react';
import { Layer, Text } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
import Tick from './Tick';

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

const HAxis = props => {
  const {
    color,
    scale: scaleName,
    name = scaleName,
    ticks: nTicks,
    unit = '',
  } = props;
  const position = usePosition(props);

  const { width, x, y } = useLayout({ ...props, name, position });
  const scale = useScale({ ...props, size: width });

  if (!scale) {
    return null;
  }

  const ticks = scale.ticks ? scale.ticks(nTicks) : scale.domain();

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

HAxis.defaultProps = {
  height: 25,
};

HAxis.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number, // eslint-disable-line
  name: PropTypes.string,
  scale: PropTypes.string,
  ticks: PropTypes.number,
  unit: PropTypes.string,
};

export default HAxis;
