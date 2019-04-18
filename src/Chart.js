import React, { Component, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Layer, SVG } from 'calvin-svg';

import Layout from './Layout';

const Context = createContext({
  scales: {},
  setScale() {},
});

const { Provider } = Context;

const useScales = names => {
  const { scales } = useContext(Context);

  return names.map(name => scales[name]);
};

const useScale = name => {
  return useScales([name]);
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
      <SVG {...props}>
        <Layer transform="scale(1, -1)">
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
};

export { Context, useScale, useScales };

export default Chart;
