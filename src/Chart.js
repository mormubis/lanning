import React, { Component, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Layer, SVG } from 'calvin-svg';

import Layout from './Layout';

const Context = createContext({
  scales: {},
  setScale() {},
});

const { Provider } = Context;

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
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
  };

  state = { scales: {} };

  setScale = (name, value) => {
    this.setState(prevState => ({
      scales: { ...prevState.scales, [name]: value },
    }));
  };

  render() {
    const { setScale } = this;
    const { children, height, width, ...props } = this.props;
    const { scales } = this.state;

    return (
      <SVG height={height} width={width} {...props}>
        <Layer transform={`scale(1, -1) translate(0, ${-height})`}>
          <Provider value={{ scales, setScale }}>
            <Layout height={height} width={width}>
              {children}
            </Layout>
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
