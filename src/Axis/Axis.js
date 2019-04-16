import React, { useMemo } from 'react';
import { Layer } from 'calvin-svg';
import PropTypes from 'prop-types';

import Tick from './Tick';

const OPPOSITE = {
  bottom: 'top',
  left: 'right',
  right: 'left',
  top: 'bottom',
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

const Axis = props => {
  const {
    children,
    color,
    height,
    scale,
    ticks: steps,
    unit,
    width,
    x,
    y,
  } = props;

  if (!scale) {
    return null;
  }

  const position = usePosition(props);
  const ticks = scale.ticks(steps);

  const orientation = useOrientation({
    horizontal: position === 'left' || position === 'right',
    vertical: position === 'bottom' || position === 'top',
  });
  const isHorizontal = orientation === 'horizontal';

  const inverted =
    (isHorizontal && position === 'top') ||
    (!isHorizontal && position === 'left');

  if (children) {
    return children({
      height,
      inverted,
      orientation,
      position,
      scale,
      ticks,
      unit,
      width,
      x,
      y,
    });
  }

  return (
    <Layer x={x} y={y}>
      {ticks.map(tick => (
        <Tick
          color={color}
          key={tick}
          stickTo={OPPOSITE[position]}
          {...(isHorizontal
            ? {
                x: scale(tick),
                y: -height * !inverted + 6 * (inverted ? -1 : 1),
              }
            : {
                x: width * !inverted + 6 * (inverted ? 1 : -1),
                y: -scale(tick),
              })}
        >
          {`${tick} ${unit}`}
        </Tick>
      ))}
    </Layer>
  );
};

Axis.defaultProps = {
  color: '#222222',
  height: 0,
  ticks: 2,
  width: 0,
  x: 0,
  y: 0,
};

Axis.propTypes = {
  children: PropTypes.func,
  color: PropTypes.string,
  height: PropTypes.number,
  ticks: PropTypes.number,
  unit: PropTypes.string,
  scale: PropTypes.func,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Axis;
