/**
 * objects.js — Industrial objects: crates, barrels, pallets as InstancedMesh
 * 
 * Each instance stores two transforms:
 *   A (chaos): tilted, displaced, some elevated
 *   B (order): aligned to a 2.4-unit grid, rotation 0
 * 
 * The order factor per object is o_i = smoothstep(s_i, s_i + 0.14, u),
 * with s_i offset so the "order wave" travels ahead of the camera.
 */
import * as THREE from 'three';
import { sm, lerp } from './scrollState.js';

const GRID_SPACING = 2.4;
const AISLE_WIDTH = 3.0;
const ROWS = 12;
const COLS_PER_SIDE = 4;

// Seeded pseudo-random for deterministic chaos
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Create the instanced industrial objects
 * @param {THREE.Scene} scene
 * @param {number} instanceCount - Total instances (reduced on mobile)
 * @returns {Object} { meshes, update(u) }
 */
export function createIndustrialObjects(scene, instanceCount = 96) {
  const rand = seededRandom(42);

  // Shared geometries
  const crateGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
  const barrelGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 12);
  const palletGeo = new THREE.BoxGeometry(1.4, 0.15, 1.0);

  // Materials: chaos = warm amber tones, order = blue medium
  const matChaosAmber = new THREE.MeshStandardMaterial({
    color: 0xFFC800,
    roughness: 0.75,
    metalness: 0.1,
  });
  const matChaosDark = new THREE.MeshStandardMaterial({
    color: 0x2A3040,
    roughness: 0.85,
    metalness: 0.05,
  });
  const matOrder = new THREE.MeshStandardMaterial({
    color: 0x1F4FA3,
    roughness: 0.6,
    metalness: 0.15,
  });

  // Distribute instances across types
  const crateCount = Math.floor(instanceCount * 0.45);
  const barrelCount = Math.floor(instanceCount * 0.3);
  const palletCount = instanceCount - crateCount - barrelCount;

  const cratesMesh = new THREE.InstancedMesh(crateGeo, matChaosDark, crateCount);
  const barrelsMesh = new THREE.InstancedMesh(barrelGeo, matChaosAmber, barrelCount);
  const palletsMesh = new THREE.InstancedMesh(palletGeo, matChaosDark, palletCount);

  cratesMesh.castShadow = false;
  cratesMesh.receiveShadow = false;
  barrelsMesh.castShadow = false;
  barrelsMesh.receiveShadow = false;
  palletsMesh.castShadow = false;
  palletsMesh.receiveShadow = false;

  // Store transforms per instance: { chaosMatrix, orderMatrix, orderStart }
  const instanceData = [];

  const dummy = new THREE.Object3D();
  const colorAmber = new THREE.Color(0xFFC800);
  const colorDarkGray = new THREE.Color(0x2A3040);
  const colorBlue = new THREE.Color(0x1F4FA3);
  const colorAccent = new THREE.Color(0xFFC800);
  const tempColor = new THREE.Color();

  function generateTransforms(mesh, count, baseYOffset, heightScale) {
    for (let i = 0; i < count; i++) {
      // Order position: grid on both sides of aisle
      const row = Math.floor(i / (COLS_PER_SIDE * 2));
      const col = i % (COLS_PER_SIDE * 2);
      const side = col < COLS_PER_SIDE ? -1 : 1;
      const localCol = col < COLS_PER_SIDE ? col : col - COLS_PER_SIDE;

      const orderX = side * (AISLE_WIDTH + localCol * GRID_SPACING);
      const orderZ = -row * GRID_SPACING - 2;
      const orderY = baseYOffset;

      // Order transform
      dummy.position.set(orderX, orderY, orderZ);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, heightScale, 1);
      dummy.updateMatrix();
      const orderMatrix = dummy.matrix.clone();

      // Chaos transform: displaced, tilted, some floating
      const chaosX = orderX + (rand() - 0.5) * 4;
      const chaosZ = orderZ + (rand() - 0.5) * 3;
      const chaosY = baseYOffset + (rand() > 0.7 ? rand() * 2.5 : 0);
      const chaosRotX = (rand() - 0.5) * 1.2;
      const chaosRotY = rand() * Math.PI * 2;
      const chaosRotZ = (rand() - 0.5) * 0.8;
      const chaosScale = 0.7 + rand() * 0.6;

      dummy.position.set(chaosX, chaosY, chaosZ);
      dummy.rotation.set(chaosRotX, chaosRotY, chaosRotZ);
      dummy.scale.set(chaosScale, heightScale * chaosScale, chaosScale);
      dummy.updateMatrix();
      const chaosMatrix = dummy.matrix.clone();

      // Order wave start: objects further back start ordering later
      // Camera travels from z=30 to z=-14, so map z to u offset
      const normalizedZ = (orderZ + 30) / 60; // rough [0, 1]
      const orderStart = 0.25 + normalizedZ * 0.45; // order begins between u=0.25 and u=0.70

      instanceData.push({ mesh, index: i, chaosMatrix, orderMatrix, orderStart });

      // Set initial chaos state
      mesh.setMatrixAt(i, chaosMatrix);

      // Set initial color: 1 in 3 amber, rest dark gray
      const isAmber = rand() < 0.33;
      mesh.setColorAt(i, isAmber ? colorAmber : colorDarkGray);
    }
  }

  generateTransforms(cratesMesh, crateCount, 0.5, 1.0);
  generateTransforms(barrelsMesh, barrelCount, 0.6, 1.0);
  generateTransforms(palletsMesh, palletCount, 0.08, 1.0);

  scene.add(cratesMesh, barrelsMesh, palletsMesh);

  // Interpolation matrices
  const chaosPos = new THREE.Vector3();
  const chaosQuat = new THREE.Quaternion();
  const chaosScale = new THREE.Vector3();
  const orderPos = new THREE.Vector3();
  const orderQuat = new THREE.Quaternion();
  const orderScale = new THREE.Vector3();

  /**
   * Update all instances based on scroll progress u
   * @param {number} u - Normalized scroll [0, 1]
   */
  function update(u) {
    let needsCrateUpdate = false;
    let needsBarrelUpdate = false;
    let needsPalletUpdate = false;

    for (const data of instanceData) {
      const o = sm(data.orderStart, data.orderStart + 0.14, u);

      // Decompose both matrices
      data.chaosMatrix.decompose(chaosPos, chaosQuat, chaosScale);
      data.orderMatrix.decompose(orderPos, orderQuat, orderScale);

      // Interpolate
      dummy.position.lerpVectors(chaosPos, orderPos, o);
      dummy.quaternion.slerpQuaternions(chaosQuat, orderQuat, o);
      dummy.scale.lerpVectors(chaosScale, orderScale, o);
      dummy.updateMatrix();

      data.mesh.setMatrixAt(data.index, dummy.matrix);

      // Color: lerp from chaos color to blue, with occasional yellow accent
      const isAccent = data.index % 7 === 0;
      tempColor.lerpColors(colorDarkGray, isAccent ? colorAccent : colorBlue, o);
      data.mesh.setColorAt(data.index, tempColor);

      if (data.mesh === cratesMesh) needsCrateUpdate = true;
      else if (data.mesh === barrelsMesh) needsBarrelUpdate = true;
      else needsPalletUpdate = true;
    }

    if (needsCrateUpdate) {
      cratesMesh.instanceMatrix.needsUpdate = true;
      if (cratesMesh.instanceColor) cratesMesh.instanceColor.needsUpdate = true;
    }
    if (needsBarrelUpdate) {
      barrelsMesh.instanceMatrix.needsUpdate = true;
      if (barrelsMesh.instanceColor) barrelsMesh.instanceColor.needsUpdate = true;
    }
    if (needsPalletUpdate) {
      palletsMesh.instanceMatrix.needsUpdate = true;
      if (palletsMesh.instanceColor) palletsMesh.instanceColor.needsUpdate = true;
    }
  }

  function dispose() {
    crateGeo.dispose();
    barrelGeo.dispose();
    palletGeo.dispose();
    matChaosAmber.dispose();
    matChaosDark.dispose();
    matOrder.dispose();
    scene.remove(cratesMesh, barrelsMesh, palletsMesh);
    cratesMesh.dispose();
    barrelsMesh.dispose();
    palletsMesh.dispose();
  }

  return { meshes: [cratesMesh, barrelsMesh, palletsMesh], update, dispose };
}
