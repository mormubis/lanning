import React, { createContext, useContext } from 'react';
import { Layer } from 'calvin-svg';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';

import { useLayout } from '../Layout';

const Context = createContext({ uuid: uuid() });

const useOverlay = () => {
  return useContext(Context);
};

const Overlay = () => {
  const { x, y } = useLayout({ name: 'tooltip', position: 'overlay' });
  const id = useOverlay();

  return <Layer id={id} label="overlay" pointerEvents="none" x={x} y={y} />;
};

export { Context, useOverlay };

export default Overlay;
