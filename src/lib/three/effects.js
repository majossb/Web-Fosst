/**
 * scanner.js — Expanding scan ring for Chapter 1 (Diagnóstico)
 * blueprint.js — Blue grid that draws on the floor for Chapter 2 (Plan)
 */
import * as THREE from 'three';
import { sm } from './scrollState.js';

/**
 * Create the scanner ring that pulses across the floor during Chapter 1
 */
export function createScanner(scene) {
  const ringGeo = new THREE.RingGeometry(0.5, 12, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xFFC800,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.05, -6);
  scene.add(ring);

  let cycleTime = 0;

  function update(u, dt) {
    // Active only during Chapter 1 (u: 0.20 - 0.40)
    const visibility = sm(0.20, 0.24, u) * (1 - sm(0.36, 0.40, u));
    
    if (visibility < 0.01) {
      ringMat.opacity = 0;
      return;
    }

    cycleTime += dt;
    const cycle = (cycleTime * 0.4) % 1; // Complete cycle every ~2.5s

    // Ring expands from small to large
    const scale = 0.3 + cycle * 2.5;
    ring.scale.set(scale, scale, 1);

    // Opacity peaks at start and fades out as ring expands
    const ringOpacity = (1 - cycle) * 0.4 * visibility;
    ringMat.opacity = ringOpacity;
  }

  function dispose() {
    ringGeo.dispose();
    ringMat.dispose();
    scene.remove(ring);
  }

  return { mesh: ring, update, dispose };
}

/**
 * Create the blueprint grid that appears during Chapter 2 (Plan)
 */
export function createBlueprint(scene) {
  const gridSize = 40;
  const gridDivisions = 20;

  const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x1F4FA3, 0x1F4FA3);
  grid.position.set(0, 0.02, -10);
  grid.material.transparent = true;
  grid.material.opacity = 0;
  grid.material.depthWrite = false;
  scene.add(grid);

  function update(u) {
    // Appear during Chapter 2 (u: 0.40 - 0.60), persist through rest
    const opacity = sm(0.38, 0.50, u) * 0.3;
    grid.material.opacity = opacity;
  }

  function dispose() {
    grid.geometry.dispose();
    grid.material.dispose();
    scene.remove(grid);
  }

  return { mesh: grid, update, dispose };
}
