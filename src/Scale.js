import { useContext, useEffect, useMemo } from 'react';
import { extent, tickStep } from 'd3';

import { Context } from './Chart';
import Scales from './Scales';

const useDomain = ({ data, from, to, values }) => {
  return useMemo(() => {
    const continuous = values === undefined;
    let domain = [];

    switch (true) {
      case values !== undefined:
        domain = values;
        break;
      case from !== undefined && to !== undefined:
        domain = [from, to];
        break;
      default:
        domain = extent(data);
        break;
    }

    return [domain, continuous];
  }, [data, from, to, values]);
};

const Scale = props => {
  const { name, ticks, type } = props;
  const { setScale } = useContext(Context);
  const [defaultDomain, isContinuous] = useDomain(props);

  const Type = Scales[!isContinuous ? 'point' : type] || Scales.linear;

  let domain = defaultDomain;
  if (isContinuous) {
    const [start, stop] = defaultDomain;
    const step = tickStep(start, stop, ticks);

    domain = [start, Math.ceil(stop / step) * step];
  }

  const scale = Type();
  scale.domain(domain);

  useEffect(() => {
    setScale(name, scale);
  }, [name, defaultDomain, ticks, type]);

  return null;
};

export default Scale;
