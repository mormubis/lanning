import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Text as Shape } from 'calvin-svg';

const Text = ({ forwardedRef, y = 0, ...props }) => (
  <Shape y={-y} {...props} ref={forwardedRef} transform="scale(1, -1)" />
);

Text.propTypes = {
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  y: PropTypes.number,
};

export default forwardRef((props, ref) => (
  <Text {...props} forwardedRef={ref} />
));
