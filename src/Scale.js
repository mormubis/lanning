import { createContext, useContext, useMemo } from 'react';
import { extent, tickStep } from 'd3';

import Scales from './Scales';

const context = createContext({ set() {} });

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
  const { name, type } = props;
  const { set } = useContext(context);
  const [domain, isContinuous] = useDomain(props);

  const Type = Scales[!isContinuous ? 'point' : type] || Scales.linear;

  let fixedDomain = domain;
  if (isContinuous) {
    const step = tickStep(domain[0], domain[1]);

    fixedDomain = [domain[0], Math.ceil(domain[1] / step) * step];
  }

  const scale = Type();
  scale.domain(fixedDomain);

  set(name, scale);

  return null;
};

export default Scale;