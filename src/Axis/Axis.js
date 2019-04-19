import React, { useMemo } from 'react';
import { extent } from 'd3';
import PropTypes from 'prop-types';

import { useScale } from '../Chart';
import { useLayout } from '../Layout';
import Scale from '../Scale';
import Scales from '../Scales';

const useDomain = ({ data, from, to, values }) => {
  return useMemo(() => {
    let domain = [];

    switch (true) {
      case values !== undefined:
        domain = values;
        break;
      case from !== undefined && to !== undefined:
        domain = [from, to];
        break;
      default:
        domain = data && extent(data);
        break;
    }

    return domain;
  }, [data, from, to, values]);
};

const useOrientation = ({ horizontal, vertical }) => {
  return useMemo(() => {
    return horizontal ? 'horizontal' : 'vertical';
  }, [horizontal, vertical]);
};

const usePosition = ({ bottom, left, right, top }) => {
  return useMemo(() => {
    switch (true) {
      case bottom:
        return 'bottom';
      case right:
        return 'right';
      case top:
        return 'top';
      case left:
      default:
        return 'left';
    }
  }, [bottom, left, right, top]);
};

const Axis = ({ children, name, ticks: nTicks, type, unit, ...rest }) => {
  const domain = useDomain(rest);
  const position = usePosition(rest);
  const orientation = useOrientation({
    horizontal: position === 'left' || position === 'right',
    vertical: position === 'bottom' || position === 'top',
  });
  const isHorizontal = orientation === 'horizontal';

  const { height, width, x, y } = useLayout({ name, position, ...rest });
  const scale = useScale({ name, range: isHorizontal ? width : height });

  if (!scale) {
    return null;
  }

  const ticks = scale.ticks(nTicks);

  const inverted =
    (isHorizontal && position === 'top') ||
    (!isHorizontal && position === 'left');

  return (
    <>
      <Scale
        domain={domain}
        key={name}
        name={name}
        ticks={nTicks}
        type={type}
      />
      {children({
        height,
        inverted,
        name,
        orientation,
        position,
        scale,
        ticks,
        unit,
        width,
        x,
        y,
      })}
    </>
  );
};

Axis.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  ticks: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(Scales)),
  unit: PropTypes.string,
};

export { useDomain };

export default Axis;
