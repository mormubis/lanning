import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Layer, SVG } from 'calvin-svg';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid/v4';

import Layout from './Layout';
import Overlay, { Context as OverlayContext } from './Shapes/Overlay';

const Context = createContext({
  scales: {},
  setScale() {},
});

const { Provider } = Context;
const { Provider: OverlayProvider } = OverlayContext;

const useScales = ({ scales: names = [], ranges = [] }) => {
  const { scales } = useContext(Context);

  return names
    .map((name, index) => {
      let scale = scales[name];

      if (scale) {
        scale = scale.copy();
        scale.range([0, ranges[index]]);
      }

      return scale;
    })
    .filter(Boolean);
};

const useScale = ({ name, range }) => {
  return useScales({ scales: [name], ranges: [range] })[0];
};

const Chart = ({
  bottom = 0,
  children,
  height,
  left = 0,
  right = 0,
  top = 0,
  width,
  ...props
}) => {
  const id = useRef(uuid());
  const [scales, setScales] = useState({});

  const setScale = useCallback((name, value) => {
    setScales(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <SVG height={height} width={width} {...props}>
      <Layer transform={`scale(1, -1) translate(${left}, ${-height + bottom})`}>
        <Provider value={{ scales, setScale }}>
          <OverlayProvider value={id.current}>
            <Layout height={height - top - bottom} width={width - left - right}>
              {children}
              <Overlay />
            </Layout>
          </OverlayProvider>
        </Provider>
      </Layer>
    </SVG>
  );
};

Chart.propTypes = {
  bottom: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  height: PropTypes.number.isRequired,
  left: PropTypes.number,
  right: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number.isRequired,
};

export { Context, useScale, useScales };

export default Chart;
