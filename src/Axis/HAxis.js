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
  height = 25,
  name,
  ticks: nTicks,
  type,
  unit = '',
  ...rest
}) => {
  const domain = useDomain(rest);
  const position = usePosition(rest);

  const { width, x, y } = useLayout({ name, position, height, ...rest });

  const scale = useScale({ name, range: width });

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
          <Tick color={color} key={tick} stickTo="left" x={scale(tick)} y={0}>
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
