import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { memoize } from './utils';

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
    throw new Error('You provided a component without name, please use name');
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

const calcSize = (components = [], isPilingUp = false) => {
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
};

const Layout = ({ children, height, width }) => {
  const components = useRef({
    bottom: {},
    center: {},
    left: {},
    right: {},
    top: {},
  });
  const [canvas, setCanvas] = useState({});

  const calculate = memoize(
    cmp => {
      const SVGHeight = height;
      const SVGWidth = width;

      const regions = Object.entries(cmp).reduce(
        (acc, [position, componentMap]) => {
          const isStacking = position === 'bottom' || position === 'top';

          return {
            ...acc,
            [position]: calcSize(Object.values(componentMap), isStacking),
          };
        },
        {},
      );
      const { bottom, center, left, right, top } = cmp;

      return {
        ...Object.entries(bottom).reduce(
          (acc, [name, size], index) => ({
            ...acc,
            [name]: {
              height: size.height,
              width: SVGWidth - regions.left.width - regions.right.width,
              x: regions.left.width,
              y: calcSize(Object.values(bottom).slice(0, index), true).height,
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
              x: calcSize(Object.values(left).slice(0, index), false).width,
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
                calcSize(Object.values(right).slice(0, index), false).width,
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
                calcSize(Object.values(top).slice(0, index), true).height,
            },
          }),
          {},
        ),
      };
    },
    (...argv) => JSON.stringify(argv),
  );

  const setComponentInPosition = ({ name, ...size }, position) => {
    setCanvas(() => {
      const prevComponents = components.current;

      components.current = {
        ...prevComponents,
        [position]: {
          ...prevComponents[position],
          [name]: size,
        },
      };

      return calculate(components.current);
    });
  };

  useEffect(() => {
    setCanvas(() => calculate(components.current));
  }, [height, width]);

  return (
    <Provider value={{ canvas, setComponentInPosition }}>{children}</Provider>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  height: PropTypes.number,
  width: PropTypes.number,
};

export { useLayout };

export default Layout;
