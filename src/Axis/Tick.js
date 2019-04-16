import React from 'react';
import { Text } from 'calvin-svg';
import PropTypes from 'prop-types';

const Tick = ({ stickTo, ...props }) => {
  const isHorizontal = stickTo === 'left' || stickTo === 'right';

  const textAlign = isHorizontal ? stickTo : 'center';

  let verticalAlign = 'middle';

  if (!isHorizontal) {
    verticalAlign = stickTo === 'bottom' ? 'baseline' : 'top';
  }

  return (
    <Text
      fontSize={12}
      textAlign={textAlign}
      verticalAlign={verticalAlign}
      {...props}
      transform="scale(1, -1)"
    />
  );
};

Tick.defaultProps = {
  stickTo: 'bottom',
};

Tick.propTypes = {
  stickTo: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
};

export default Tick;
