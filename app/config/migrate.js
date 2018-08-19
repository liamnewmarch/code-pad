function migrateFiddle(key) {
  try {
    const json = localStorage.getItem(key);
    const fiddle = JSON.parse(json);
    // localStorage.removeItem(key); // TODO enable this
    return fiddle;
  } catch (error) {
    console.warn('Migration failed: ', error);
  }
}

export default function() {
  const json = localStorage.getItem('fiddles');
  if (!json) return;
  try {
    const keys = JSON.parse(json);
    const fiddles = keys.map(migrateFiddle)
      .filter(fiddle => fiddle)
      .reduce((fiddles, fiddle) => {
        fiddles[fiddle.key] = fiddle;
        return fiddles;
      }, {});
    // localStorage.removeItem('fiddles'); // TODO enable this
    return { fiddles };
  } catch (error) {
    console.warn('Migration failed: ', error);
  }
};
