export function flood(x, y, replacementTile, prevTile, data, grid, visited = new Map()) {
  const index = XYToIndex(x, y, grid);
  const indexTile = data[index];

  if (x < 0 || x >= grid.columns || y < 0 || y >= grid.rows) return;
  if (!compareTiles(prevTile, indexTile)) return;

  data[index] = replacementTile;
  visited.set(index, 1);

  if (!visited.has(XYToIndex(x, y - 1, grid))) flood(x, y - 1, replacementTile, prevTile, data, grid, visited);
  if (!visited.has(XYToIndex(x + 1, y, grid))) flood(x + 1, y, replacementTile, prevTile, data, grid, visited);
  if (!visited.has(XYToIndex(x, y + 1, grid))) flood(x, y + 1, replacementTile, prevTile, data, grid, visited);
  if (!visited.has(XYToIndex(x - 1, y, grid))) flood(x - 1, y, replacementTile, prevTile, data, grid, visited);
}

export function XYToIndex(x, y, grid) {
  return y * grid.columns + x;
}

export function IndexToXY(index, grid) {
  return [Math.floor(index / grid.columns), index % grid.columns];
}

export function compareTiles(t1, t2) {
  return t1[0] === t2[0] && t1[1] === t2[1]
}
