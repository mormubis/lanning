import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Layer } from 'calvin-svg';

import { useScales } from './Chart';
import { useLayout } from './Layout';
import Tooltip from './Shapes/Tooltip';

const Serie = ({
  children = () => {},
  data: raw = [],
  left = 0,
  ranges: rawRanges,
  scales: scaleNames = [],
  name = scaleNames.join(','),
  top = 0,
  ...rest
}) => {
  const { height, width, x: offsetLeft, y: offsetTop } = useLayout({
    ...rest,
    left,
    name,
    top,
  });
  const ranges = (rawRanges || []).length > 0 ? rawRanges : [width, height];
  const scales = useScales({ ranges, scales: scaleNames });

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [tooltip, setTooltip] = useState({});

  const onOut = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  const onOver = useCallback(
    ({ color, index, transform, x, y }) => {
      setTooltipVisible(true);
      setTooltip({
        color,
        message: transform(
          ...raw[index].map((coordinate, rindex) => {
            const scale = scales[rindex];
            const domain = scale.domain();
            const mapped = scale(coordinate);

            return mapped !== undefined ? mapped : scale(domain[coordinate]);
          }),
          index,
        ),
        x: left + x,
        y: top + y,
      });
    },
    [scales],
  );

  const dimensions = raw[0].length;

  if (
    raw.length === 0 ||
    scales.length !== dimensions ||
    ranges.filter(Boolean).length !== dimensions
  ) {
    return null;
  }

  const data = raw.map(axis =>
    axis.map((coordinate, index) => {
      const scale = scales[index];
      const domain = scale.domain();
      const mapped = scale(coordinate);

      return mapped !== undefined ? mapped : scale(domain[coordinate]);
    }),
  );

  return (
    <Layer
      height={height}
      label={name}
      width={width}
      x={offsetLeft}
      y={offsetTop}
    >
      {children({ data, height, onOut, onOver, width })}
      <Tooltip opacity={isTooltipVisible ? 1 : 0} {...tooltip} />
    </Layer>
  );
};

Serie.propTypes = {
  children: PropTypes.func,
  color: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.number,
    ]),
  ),
  left: PropTypes.number,
  name: PropTypes.string,
  ranges: PropTypes.arrayOf(PropTypes.number),
  scales: PropTypes.arrayOf(PropTypes.string),
  top: PropTypes.number,
};

export default memo(Serie);
