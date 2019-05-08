import React from 'react';
import PropTypes from 'prop-types';

import Text from '../Shapes/Text';

const Tick = ({ stickTo = 'bottom', ...props }) => {
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

Tick.propTypes = {
  stickTo: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
};

export default Tick;
