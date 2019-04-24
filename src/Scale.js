import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tickStep } from 'd3';

import { Context } from './Chart';
import Scales from './Scales';

const Scale = ({ domain = [], name, ticks = 2, type }) => {
  const { setScale } = useContext(Context);

  useEffect(() => {
    const isContinuous = domain.length === 2;

    const Type = Scales[!isContinuous ? 'point' : type] || Scales.linear;

    let fixed = domain;
    if (isContinuous) {
      const [start, stop] = domain;
      const step = tickStep(start, stop, ticks);

      fixed = [start, Math.ceil(stop / step) * step];
    }

    const scale = Type();
    scale.domain(fixed);

    setScale(name, scale);
  }, [name, JSON.stringify(domain), ticks, type]);

  return null;
};

Scale.propTypes = {
  domain: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ),
  name: PropTypes.string.isRequired,
  ticks: PropTypes.number,
  type: PropTypes.string,
};

export default Scale;
