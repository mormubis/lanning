import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useLayout } from '../Layout';
import { useScale } from '../Chart';

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

const Axis = props => {
  const { children, name, ticks: nTicks, unit } = props;

  const position = usePosition(props);
  const orientation = useOrientation({
    horizontal: position === 'left' || position === 'right',
    vertical: position === 'bottom' || position === 'top',
  });
  const isHorizontal = orientation === 'horizontal';

  const { height, width, x, y } = useLayout(props);
  const scale = useScale({ ...props, size: isHorizontal ? width : height });

  if (!scale) {
    return null;
  }

  const ticks = scale.ticks(nTicks);

  const inverted =
    (isHorizontal && position === 'top') ||
    (!isHorizontal && position === 'left');

  return children({
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
  });
};

Axis.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string,
  ticks: PropTypes.number,
  unit: PropTypes.string,
};

export default Axis;
