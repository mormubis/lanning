import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Animation, Circle, Layer, Rect } from 'calvin-svg';
import PropTypes from 'prop-types';

import { useLayout } from '../Layout';
import { useOverlay } from './Overlay';
import Text from './Text';

const HEIGHT = 32;
const OFFSET = { x: 20, y: 16 };

const Tooltip = ({ children, color, opacity, x: rawX = 0, y: rawY = 0 }) => {
  const { height: maxHeight, width: maxWidth } = useLayout({ name: 'tooltip' });
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
    setX(Math.max(Math.min(maxWidth - width + OFFSET.x, rawX), OFFSET.x));
  }, [maxWidth, rawX, width]);

  useLayoutEffect(() => {
    setY(Math.max(Math.min(maxHeight - HEIGHT + OFFSET.y, rawY), OFFSET.y));
  }, [maxHeight, rawY]);

  return createPortal(
    <Layer label="tooltip" opacity={opacity} x={x - OFFSET.x} y={y - OFFSET.y}>
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
      <Circle color={color} radius={4} x={OFFSET.x} y={OFFSET.y} />
      {children !== undefined && (
        <Text
          color="#fff"
          fontSize={12}
          ref={text}
          verticalAlign="middle"
          x={OFFSET.x + 12}
          y={OFFSET.y}
        >
          {children}
        </Text>
      )}
    </Layer>,
    document.getElementById(id),
  );
};

Tooltip.propTypes = {
  children: PropTypes.string,
  color: PropTypes.string,
  opacity: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Tooltip;
