import React from 'react';
import PropTypes from 'prop-types';

import { Layer } from 'calvin-svg';

import { useScales } from './Chart';
import { useLayout } from './Layout';

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

  return (
    <Layer height={height} width={width} x={x} y={y}>
      {children({ data, height, width })}
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
  name: PropTypes.string,
  ranges: PropTypes.arrayOf(PropTypes.number),
  scales: PropTypes.arrayOf(PropTypes.string),
};

export default Serie;
