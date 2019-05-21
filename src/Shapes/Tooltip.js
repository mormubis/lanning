import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Animation, Circle, Layer, Rect } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useLayout } from '../Layout';
import { useOverlay } from './Overlay';
import Text from './Text';

const HEIGHT = 32;
const MARGIN = 12;
const OFFSET = { left: 20, top: 16 };

const Tooltip = ({
  color,
  message = '',
  children = String(message),
  opacity,
  x: rawX = 0,
  y: rawY = 0,
}) => {
  const { height: offsetHeight, width: offsetWidth } = useLayout({
    name: 'tooltip',
  });
  const id = useOverlay();
  const prevOpacity = useRef(opacity);
  const text = useRef(null);
  const [width, setWidth] = useState(100);
  const [x, setX] = useState(rawX);
  const [y, setY] = useState(rawY);

  useEffect(() => {
    prevOpacity.current = opacity;
  }, [opacity]);

  useLayoutEffect(() => {
    if (text.current) {
      setWidth(text.current.getBBox().width + 32 + 16);
    }
  }, [children]);

  useLayoutEffect(() => {
    setX(
      Math.max(Math.min(offsetWidth - width + OFFSET.left, rawX), OFFSET.left),
    );
  }, [offsetWidth, rawX, width]);

  useLayoutEffect(() => {
    setY(
      Math.max(Math.min(offsetHeight - HEIGHT + OFFSET.top, rawY), OFFSET.top),
    );
  }, [offsetHeight, rawY]);

  return createPortal(
    <Layer
      label="tooltip"
      opacity={opacity}
      x={x - OFFSET.left}
      y={y - OFFSET.top}
    >
      <Rect color="#222" height={HEIGHT} radius={4} width={width}>
        <Animation
          attribute="opacity"
          duration={250}
          ease="linear"
          fill="freeze"
          from={prevOpacity.current}
          to={opacity}
        />
      </Rect>
      <Circle color={color} radius={4} x={OFFSET.left} y={OFFSET.top} />
      {children !== undefined && (
        <Text
          color="#fff"
          fontSize={12}
          ref={text}
          verticalAlign="middle"
          x={OFFSET.left + MARGIN}
          y={OFFSET.top}
        >
          {children}
        </Text>
      )}
    </Layer>,
    document.getElementById(id),
  );
};

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.string,
  opacity: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Tooltip;
