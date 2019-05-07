import React from 'react';
import { Layer, Line } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useLayout } from '../Layout';

const Grid = ({
  bottom = 0,
  color = '#222222',
  columns = 0,
  left = 0,
  hideBorders = false,
  right = 0,
  rows = 0,
  thickness = 1,
  top = 0,
  ...rest
}) => {
  const { height, width, x, y } = useLayout({ ...rest, name: 'grid' });

  const gap = [
    columns ? (width - left - right) / columns : width,
    rows ? (height - top - bottom) / rows : height,
  ];

  let horizontals = Array(rows ? rows + 1 : 0)
    .fill(0)
    .map((ignore, index) => index)
    .map(row => row * gap[1] + top);

  let verticals = Array(columns ? columns + 1 : 0)
    .fill(0)
    .map((ignore, index) => index)
    .map(column => column * gap[0] + left);

  if (hideBorders) {
    horizontals = horizontals.slice(1, -1);
    verticals = verticals.slice(1, -1);
  }

  horizontals = [...new Set(horizontals)];
  verticals = [...new Set(verticals)];

  return (
    <Layer name="grid" x={x} y={y}>
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
  hideBorders: PropTypes.bool,
  left: PropTypes.number,
  right: PropTypes.number,
  rows: PropTypes.number,
  thickness: PropTypes.number,
  top: PropTypes.number,
};

export default Grid;
