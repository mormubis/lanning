import React from 'react';
import PropTypes from 'prop-types';
import { Text as Shape } from 'calvin-svg';

const Text = ({ y, ...props }) => (
  <Shape y={-y} {...props} transform="scale(1, -1)" />
);

Text.propTypes = {
  y: PropTypes.number,
};

export default Text;
