import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tickStep as d3tickStep } from 'd3';

import { Context } from './Chart';
import Scales from './Scales';

function tickStep(start, stop, ticks) {
  const step = d3tickStep(start, stop, ticks);

  if (Number.isNaN(step) || !Number.isFinite(step)) {
    return 0;
  }

  if (Math.ceil((stop - start) / step) !== ticks) {
    return tickStep(start, stop + step, ticks);
  }

  return step;
}

const Scale = ({ domain = [], name, ticks = 2, type }) => {
  const { setScale } = useContext(Context);

  useEffect(() => {
    const isContinuous = domain.length === 2 && type !== 'point';

    const Type = Scales[!isContinuous ? 'point' : type] || Scales.linear;

    let fixed = domain;
    if (isContinuous) {
      const [start, stop] = domain;
      const step = tickStep(start, stop, ticks);

      fixed = [start, start + step * ticks];
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
