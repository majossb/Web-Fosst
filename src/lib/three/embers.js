/**
 * embers.js — Amber spark particles rising and recycling
 * 
 * ~400 Points that rise upward, their velocity and brightness
 * decrease as the order progresses.
 */
import * as THREE from 'three';
import { sm } from './scrollState.js';

/**
 * Create ember/spark particles
 * @param {THREE.Scene} scene
 * @param {number} count - Particle count (reduced on mobile)
 * @returns {Object} { points, update(u, dt) , dispose() }
 */
export function createEmbers(scene, count = 400) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lifetimes = new Float32Array(count);
  const sizes = new Float32Array(count);

  const SPREAD_X = 20;
  const SPREAD_Z = 40;
  const MAX_HEIGHT = 14;

  function resetParticle(i) {
    positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
    positions[i * 3 + 1] = Math.random() * 0.5;
    positions[i * 3 + 2] = -Math.random() * SPREAD_Z;

    velocities[i * 3] = (Math.random() - 0.5) * 0.3;
    velocities[i * 3 + 1] = 0.8 + Math.random() * 1.5;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

    lifetimes[i] = Math.random();
    sizes[i] = 1.5 + Math.random() * 3.0;
  }

  for (let i = 0; i < count; i++) {
    resetParticle(i);
    // Start at random heights so they don't all begin from the floor
    positions[i * 3 + 1] = Math.random() * MAX_HEIGHT;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0xFFC800,
    size: 2.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /**
   * Update particles
   * @param {number} u - Normalized scroll progress
   * @param {number} dt - Delta time in seconds
   */
  function update(u, dt) {
    // Order progress: as order increases, particles slow down and dim
    const orderFactor = sm(0.3, 0.85, u); // 0 at chaos, 1 at full order
    const speedMultiplier = 1.0 - orderFactor * 0.85;
    const opacityTarget = 0.7 - orderFactor * 0.6;

    material.opacity += (opacityTarget - material.opacity) * 0.05;

    const posAttr = geometry.getAttribute('position');

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * speedMultiplier * dt;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier * dt;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier * dt;

      // Recycle if too high or lifetime exceeded
      if (positions[i * 3 + 1] > MAX_HEIGHT) {
        resetParticle(i);
      }
    }

    posAttr.needsUpdate = true;
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  return { points, update, dispose };
}
