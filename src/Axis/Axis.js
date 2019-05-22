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

const usePosition = ({ bottom, left, right, top }) => {
  return useMemo(() => {
    switch (true) {
      case right:
        return 'right';
      case top:
        return 'top';
      case bottom:
        return 'bottom';
      case left:
      default:
        return 'left';
    }
  }, [bottom, left, right, top]);
};

const Axis = ({
  children,
  label: rawLabel,
  name,
  tickFormat = v => v,
  ticks: nTicks,
  type,
  unit: rawUnit = '',
  ...rest
}) => {
  const domain = useDomain(rest);
  const position = usePosition(rest);

  const isHorizontal = position === 'bottom' || position === 'top';

  const { height, width, x, y } = useLayout({ name, position, ...rest });
  const scale = useScale({ name, range: isHorizontal ? width : height });

  const unit = rawUnit && `(${rawUnit})`;
  const label = rawLabel ? `${rawLabel} ${unit}` : unit;

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

  const ticks = (scale.ticks ? scale.ticks(nTicks) : scale.domain()).map(
    tick => ({ label: tickFormat(tick), offset: scale(tick), value: tick }),
  );

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
        label,
        name,
        position,
        ticks,
        width,
        x,
        y,
      })}
    </>
  );
};

Axis.propTypes = {
  children: PropTypes.func.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  tickFormat: PropTypes.func,
  ticks: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(Scales)),
  unit: PropTypes.string,
};

export { useDomain };

export default Axis;
