import React, { Component, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const Context = createContext({});
const { Provider } = Context;

const useLayout = ({ height, name, position, width }) => {
  const { canvas, setComponent } = useContext(Context);

  setComponent(name, position, { height, width });

  return canvas[name] || { height: 0, width: 0, x: 0, y: 0 };
};

class Layout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    height: PropTypes.number,
    width: PropTypes.number,
  };

  components = { bottom: {}, center: {}, left: {}, right: {}, top: {} };

  state = {
    canvas: {},
  };

  setComponent = (name, position, size) => {
    this.setState(() => {
      const prevComponents = this.components;

      const components = {
        ...prevComponents,
        [position]: {
          ...prevComponents[position],
          [name]: size,
        },
      };

      return { canvas: this.paintCanvas(components) };
    });
  };

  paintCanvas(components) {
    const { height, width } = this.props;

    const padding = Object.entries(components).reduce(
      (acc, [position, component]) => ({
        ...acc,
        [position]: Object.values(component).reduce(
          (result, size) => result + size,
          0,
        ),
      }),
      {},
    );
    const { bottom, center, left, right, top } = components;

    return {
      ...Object.entries(bottom).reduce((acc, [name, size], index) => ({
        ...acc,
        [name]: {
          height: size,
          width: width - padding.left - padding.right,
          x: padding.left,
          y: Object.entries(bottom).reduce(
            (racc, [, rsize], rindex) => racc + (rindex < index ? rsize : 0),
            0,
          ),
        },
      })),
      ...Object.entries(center).reduce((acc, [name]) => ({
        ...acc,
        [name]: {
          height: height - padding.top - padding.bottom,
          width: width - padding.top - padding.bottom,
          x: padding.left,
          y: padding.bottom,
        },
      })),
      ...Object.entries(left).reduce((acc, [name, size], index) => ({
        ...acc,
        [name]: {
          height: height - padding.top - padding.bottom,
          width: size,
          x: Object.entries(left).reduce(
            (racc, [, rsize], rindex) => racc + (rindex < index ? rsize : 0),
            0,
          ),
          y: padding.bottom,
        },
      })),
      ...Object.entries(right).reduce((acc, [name, size], index) => ({
        ...acc,
        [name]: {
          height: height - padding.top - padding.bottom,
          width: size,
          x:
            width -
            size -
            Object.entries(right).reduce(
              (racc, [, rsize], rindex) => racc + (rindex < index ? rsize : 0),
              0,
            ),
          y: padding.bottom,
        },
      })),
      ...Object.entries(top).reduce((acc, [name, size], index) => ({
        ...acc,
        [name]: {
          height: size,
          width: width - padding.left - padding.right,
          x: padding.left,
          y:
            height -
            size -
            Object.entries(top).reduce(
              (racc, [, rsize], rindex) => racc + (rindex < index ? rsize : 0),
              0,
            ),
        },
      })),
    };
  }

  render() {
    const { setComponent } = this;
    const { children } = this.props;
    const { canvas } = this.state;

    return <Provider value={{ canvas, setComponent }}>{children}</Provider>;
  }
}

export { useLayout };

export default Layout;
