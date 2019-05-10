import React, { Component, createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';

const Context = createContext({});
const { Provider } = Context;

const useLayout = ({
  bottom = 0,
  height = 0,
  left = 0,
  name,
  position = 'center',
  right = 0,
  top = 0,
  width = 0,
}) => {
  if (!name) {
    throw new Error('hello');
  }

  const { canvas, setComponentInPosition } = useContext(Context);

  useEffect(() => {
    setComponentInPosition({ height, name, width }, position);
  }, [name, height, position, width]);

  const rect = canvas[name] || { height: 0, width: 0, x: 0, y: 0 };

  return {
    height: rect.height - top - bottom,
    width: rect.width - left - right,
    x: rect.x + left,
    y: rect.y + top,
  };
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

  static size(components = [], isPilingUp = false) {
    return components.reduce(
      (acc, component) => ({
        height: isPilingUp
          ? acc.height + component.height
          : Math.max(acc.height, component.height),
        width: isPilingUp
          ? Math.max(acc.width, component.width)
          : acc.width + component.width,
      }),
      { height: 0, width: 0 },
    );
  }

  components = { bottom: {}, center: {}, left: {}, right: {}, top: {} };

  state = {
    canvas: {},
  };

  calculate = memoize(
    components => {
      const { height: SVGHeight, width: SVGWidth } = this.props;

      const regions = Object.entries(components).reduce(
        (acc, [position, componentMap]) => {
          const isStacking = position === 'bottom' || position === 'top';

          return {
            ...acc,
            [position]: Layout.size(Object.values(componentMap), isStacking),
          };
        },
        {},
      );
      const { bottom, center, left, right, top } = components;

      return {
        ...Object.entries(bottom).reduce(
          (acc, [name, size], index) => ({
            ...acc,
            [name]: {
              height: size.height,
              width: SVGWidth - regions.left.width - regions.right.width,
              x: regions.left.width,
              y: Layout.size(Object.values(bottom).slice(0, index), true)
                .height,
            },
          }),
          {},
        ),
        ...Object.entries(center).reduce(
          (acc, [name]) => ({
            ...acc,
            [name]: {
              height: SVGHeight - regions.top.height - regions.bottom.height,
              width: SVGWidth - regions.left.width - regions.right.width,
              x: regions.left.width,
              y: regions.bottom.height,
            },
          }),
          {},
        ),
        ...Object.entries(left).reduce(
          (acc, [name, size], index) => ({
            ...acc,
            [name]: {
              height: SVGHeight - regions.top.height - regions.bottom.height,
              width: size.width,
              x: Layout.size(Object.values(left).slice(0, index), false).width,
              y: regions.bottom.height,
            },
          }),
          {},
        ),
        ...Object.entries(right).reduce(
          (acc, [name, size], index) => ({
            ...acc,
            [name]: {
              height: SVGHeight - regions.top.height - regions.bottom.height,
              width: size.width,
              x:
                SVGWidth -
                size.width -
                Layout.size(Object.values(right).slice(0, index), false).width,
              y: regions.bottom.height,
            },
          }),
          {},
        ),
        ...Object.entries(top).reduce(
          (acc, [name, size], index) => ({
            ...acc,
            [name]: {
              height: size.height,
              width: SVGWidth - regions.left.width - regions.right.width,
              x: regions.left.width,
              y:
                SVGHeight -
                size.height -
                Layout.size(Object.values(top).slice(0, index), true).height,
            },
          }),
          {},
        ),
      };
    },
    (...argv) => JSON.stringify(argv),
  );

  setComponentInPosition = ({ name, ...size }, position) => {
    this.setState(() => {
      const prevComponents = this.components;

      this.components = {
        ...prevComponents,
        [position]: {
          ...prevComponents[position],
          [name]: size,
        },
      };

      return { canvas: this.calculate(this.components) };
    });
  };

  render() {
    const { setComponentInPosition } = this;
    const { children } = this.props;
    const { canvas } = this.state;

    return (
      <Provider value={{ canvas, setComponentInPosition }}>{children}</Provider>
    );
  }
}

export { useLayout };

export default Layout;
