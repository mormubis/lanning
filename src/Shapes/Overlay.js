import React from 'react';
import { Layer } from 'calvin-svg';

import { useLayout } from '../Layout';

const Overlay = () => {
  const { x, y } = useLayout({ name: 'tooltip' });

  return <Layer id="hello" pointerEvents="none" x={x} y={y} />;
};

export default Overlay;
