function memoize(func, hasher = v => v) {
  const cache = {};

  return (...argv) => {
    const key = String(hasher(...argv));

    if (!cache[key]) {
      cache[key] = func(...argv);
    }

    return cache[key];
  };
}

export { memoize };

export default { memoize };
