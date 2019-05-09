import React, { Component, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Layer, SVG } from 'calvin-svg';
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

class Chart extends Component {
  static defaultProps = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  };

  static propTypes = {
    bottom: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    height: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
  };

  state = { scales: {} };

  id = uuid();

  setScale = (name, value) => {
    this.setState(prevState => ({
      scales: { ...prevState.scales, [name]: value },
    }));
  };

  render() {
    const { setScale } = this;
    const {
      bottom,
      children,
      height,
      left,
      right,
      top,
      width,
      ...props
    } = this.props;
    const { scales } = this.state;

    return (
      <SVG height={height} width={width} {...props}>
        <Layer
          transform={`scale(1, -1) translate(${left}, ${-height + bottom})`}
        >
          <Provider value={{ scales, setScale }}>
            <OverlayProvider value={this.id}>
              <Layout
                height={height - top - bottom}
                width={width - left - right}
              >
                {children}
                <Overlay />
              </Layout>
            </OverlayProvider>
          </Provider>
        </Layer>
      </SVG>
    );
  }
}

Chart.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export { Context, useScale, useScales };

export default Chart;
