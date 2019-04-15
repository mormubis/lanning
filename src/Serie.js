import React from 'react';
import PropTypes from 'prop-types';

import { Layer } from 'calvin-svg';

const Serie = ({
  children = () => {},
  data: raw,
  height,
  scales,
  width,
  sizes = [width, height],
  x,
  y,
}) => {
  const dimensions = raw[0].length;

  if (scales.length !== dimensions) {
    return null;
  }

  scales.map((scale, index) => scale.range([0, sizes[index] || 0]));

  const data = raw.map(datum =>
    datum.map((value, index) => scales[index](value)),
  );

  return (
    <Layer x={x} y={y}>
      {children({ data })}
    </Layer>
  );
};

Serie.defaultProps = {
  children() {},
  data: [],
  height: 0,
  scales: [],
  sizes: [],
  width: 0,
  x: 0,
  y: 0,
};

Serie.propTypes = {
  children: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.number,
    ]),
  ),
  height: PropTypes.number,
  scales: PropTypes.arrayOf(PropTypes.func),
  sizes: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Serie;
