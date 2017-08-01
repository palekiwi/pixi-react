/* global beforeEach, describe, it, expect */
import vector from '../lib/vector.js';
import { flatmapToTilesArray } from '../lib/case-2d.js';
import {
  validateStructuresOverlap,
  validateStructuresPlacement,
  validateSystemComponents,
  validateTerrainSize
} from '../lib/validate-case2d.js';

describe('validateCase2d', () => {
  let options = {};
  let errors = [];

  beforeEach(() => {
    errors = [];
    let name = 'grid project';
    let gridSize = vector(2, 2, 1);
    let terrainTiles = flatmapToTilesArray([
      [{}, {}],
      [{}, {}]
    ]);
    let system = {components: [{name: 'biomass'}]};
    let structureTiles = [
      {data: {name: 'biomass'}, texture: {size: vector(1,1,1)}, position: vector(0,0,0)}
    ];
    options = {name, gridSize, terrainTiles, system, structureTiles};
  });

  describe('validateTerrainSize', () => {
    it('returns errors when terrain does not fit gridSize', () => {
      options.gridSize = vector(2, 2);
      options.terrainTiles = flatmapToTilesArray([
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}]
      ]);
      let res = validateTerrainSize(options, []);

      expect(res.length).toEqual(1);
    });
  });

  describe('validateStructuresPlacement', () => {
    beforeEach(() => {
      options.gridSize = vector(2, 2, 1);
      options.terrainTiles = flatmapToTilesArray([[{}, null]]);
      options.structureTiles = [
        {data: {name: 'biomass'}, texture: {size: vector(2,2,1)}, position: vector(1, 1)}
      ];
    });

    it('return an error when structureTile is placed on a tile without terrain', () => {
      let res = validateStructuresPlacement(options, []);
      expect(res.length).toEqual(1);
    });

    it('detects correct missing tiles ', () => {
      let res = validateStructuresPlacement(options, []);
      let matchedTiles = res[0].match(/\([^)]+\)/g);
      let missingTiles = [vector(1,2), vector(2,1), vector(2,2)];
      /* eslint-disable no-console */
      console.log(vector(1,1).surfacePoints(vector(2,2,1)).toString());

      expect(matchedTiles.length).toEqual(missingTiles.length);
    });
  });

  describe('validateStructuresOverlap', () => {
    it('structureTiles overlap each other', () => {
      options.structureTiles = [
        {data: {name: 'biomass'}, texture: {size: vector(1,0,0)}, position: vector(0, 0)},
        {data: {name: 'house'}, texture: {size: vector(0,0,0)}, position: vector(1, 0)}
      ];
    });
  });

  describe('validateSystemComponents', () => {
    it('there is no structureTile for every system component', () => {
      options.structureTiles = [
        {data: {name: 'factory'}, texture: {size: vector(1,0,0)}, position: vector(0, 0)}
      ];
    });
  });
});