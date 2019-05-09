import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Layer } from 'calvin-svg';

import { useScales } from './Chart';
import { useLayout } from './Layout';
import Tooltip from './Shapes/Tooltip';

const Serie = ({
  children = () => {},
  data: raw = [],
  ranges = [],
  scales: scaleNames = [],
  name = scaleNames.join(','),
  ...rest
}) => {
  const { height, width, x, y } = useLayout({ ...rest, name });
  const scales = useScales({
    ranges: ranges.length > 0 ? ranges : [width, height],
    scales: scaleNames,
  });

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [tooltip, setTooltip] = useState({});

  const dimensions = raw[0].length;

  if (scales.length !== dimensions) {
    return null;
  }

  const data = raw.map(datum =>
    datum.map((value, index) => {
      const domain = scales[index].domain();
      const mapped = scales[index](value);

      return mapped !== undefined ? mapped : scales[index](domain[value]);
    }),
  );

  const closeTooltip = () => {
    setTooltipVisible(false);
  };

  const openTooltip = ({ color, message, x: tooltipX, y: tooltipY }) => {
    setTooltipVisible(true);
    setTooltip({ color, message, x: tooltipX, y: tooltipY });
  };

  return (
    <Layer height={height} width={width} x={x} y={y}>
      {children({
        data,
        height,
        tooltip: { close: closeTooltip, open: openTooltip },
        width,
      })}
      <Tooltip opacity={isTooltipVisible ? 1 : 0} {...tooltip}>
        {tooltip.message}
      </Tooltip>
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
  name: PropTypes.string,
  ranges: PropTypes.arrayOf(PropTypes.number),
  scales: PropTypes.arrayOf(PropTypes.string),
};

export default Serie;
