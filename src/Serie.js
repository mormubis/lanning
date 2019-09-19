import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Layer } from 'calvin-svg';

import { useScales } from './Chart';
import { useLayout } from './Layout';
import Tooltip from './Shapes/Tooltip';

const Serie = ({
  children = () => {},
  data: raw = [],
  domain = raw,
  ranges: defaultRanges = [],
  scales: scaleNames = [],
  name = scaleNames.join(','),
  onOut = () => {},
  onOver = () => {},
  padding,
  tooltip: transform = (_, v) => v,
  tooltipMessage = transform,
  ...rest
}) => {
  const { height, width, x, y } = useLayout({ ...rest, ...padding, name });
  const ranges = defaultRanges.length > 0 ? defaultRanges : [width, height];
  const scales = useScales({ ranges, scales: scaleNames });

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [tooltip, setTooltip] = useState({});

  const handleOut = useCallback((...argv) => {
    setTooltipVisible(false);

    onOut(...argv);
  }, []);

  const handleTooltip = useCallback(
    ({ color, index, x: tooltipX, y: tooltipY }) => {
      const argv = [
        ...domain[index].map((coordinate, rindex) => {
          const scale = scales[rindex];
          const mapped = scale(coordinate);

          return mapped !== undefined ? coordinate : scale.domain()[coordinate];
        }),
        index,
      ];
      const message =
        typeof tooltipMessage === 'function'
          ? tooltipMessage(...argv)
          : tooltipMessage;

      if (message) {
        setTooltipVisible(true);
        setTooltip({ color, message, x: tooltipX + x, y: tooltipY + y });
      }
    },
    [scales],
  );

  const dimensions = (domain[0] || []).length;

  if (
    domain.length === 0 ||
    scales.length !== dimensions ||
    ranges.filter(Boolean).length !== dimensions
  ) {
    return null;
  }

  const data = domain.map(axis =>
    axis.map((coordinate, index) => {
      const scale = scales[index];
      const mapped = scale(coordinate);

      return mapped !== undefined ? mapped : scale(scale.domain()[coordinate]);
    }),
  );

  return (
    <Layer height={height} label={name} width={width} x={x} y={y}>
      {children({
        data,
        height,
        onTooltip: handleTooltip,
        onOut: handleOut,
        onOver,
        range: data,
        width,
      })}
      <Tooltip opacity={isTooltipVisible ? 1 : 0} {...tooltip} />
    </Layer>
  );
};

Serie.propTypes = {
  children: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.number,
    ]),
  ),
  domain: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.number,
    ]),
  ),
  name: PropTypes.string,
  onOut: PropTypes.func,
  onOver: PropTypes.func,
  padding: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  ranges: PropTypes.arrayOf(PropTypes.number),
  scales: PropTypes.arrayOf(PropTypes.string),
  tooltip: PropTypes.func,
  tooltipMessage: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

export default memo(Serie);
