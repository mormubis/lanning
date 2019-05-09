import React, { createContext, useContext } from 'react';
import { Layer } from 'calvin-svg';
// We want to include this little function in our own bundle
// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid/v4';

import { useLayout } from '../Layout';

const Context = createContext({ uuid: uuid() });

const useOverlay = () => {
  return useContext(Context);
};

const Overlay = () => {
  const { x, y } = useLayout({ name: 'tooltip' });
  const id = useOverlay();

  return <Layer id={id} pointerEvents="none" x={x} y={y} />;
};

export { Context, useOverlay };

export default Overlay;
