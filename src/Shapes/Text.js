import React from 'react';
import { Text as Shape } from 'calvin-svg';

const Text = props => {
  return <Shape {...props} transform="scale(1, -1)" />;
};

export default Text;
