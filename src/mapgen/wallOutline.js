import { PartitionOutline } from "./PartitionOutline.js";
import { WallGenerator } from "./WallGenerator.js";

export function wallsFromGrid(grid, openEdges) {
  const extractor = new PartitionOutline(grid, openEdges);
  const cellEdges = extractor.filterBoundary(extractor.extract());
  const segments = extractor.toMetres(cellEdges);
  return WallGenerator.resolveJunctions(segments);
}

export function innerWallsFromGrid(grid, openEdges) {
  return WallGenerator.toInnerWalls(wallsFromGrid(grid, openEdges));
}
