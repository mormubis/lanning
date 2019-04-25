import React from 'react';
import { Layer, Line } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useLayout } from '../Layout';

const Grid = ({
  bottom = 0,
  color = '#222222',
  columns = 0,
  left = 0,
  right = 0,
  rows = 0,
  thickness = 1,
  top = 0,
  ...rest
}) => {
  const { height, width } = useLayout({ ...rest, name: 'grid' });

  const gap = [
    columns ? (width - left - right) / columns : width,
    rows ? (height - top - bottom) / rows : height,
  ];

  const horizontals = Array(rows + 1)
    .fill(0)
    .map((ignore, index) => index)
    .map(row => row * gap[1] + left);

  const verticals = Array(columns + 1)
    .fill(0)
    .map((ignore, index) => index)
    .map(column => column * gap[0] + left);

  return (
    <Layer name="grid">
      {horizontals.map(row => (
        <Line
          color={color}
          key={`${row}`}
          points={[[0, row], [width, row]]}
          thickness={thickness}
        />
      ))}
      {verticals.map(column => (
        <Line
          color={color}
          key={`${column}`}
          thickness={thickness}
          points={[[column, 0], [column, height]]}
        />
      ))}
    </Layer>
  );
};

Grid.propTypes = {
  bottom: PropTypes.number,
  color: PropTypes.string,
  columns: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
  rows: PropTypes.number,
  thickness: PropTypes.number,
  top: PropTypes.number,
};

export default Grid;
