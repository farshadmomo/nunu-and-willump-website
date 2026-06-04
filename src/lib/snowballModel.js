// Loads + parses the optimized snowball glb exactly once and caches the result.
// Called by the preloader (during the loading screen) so the model is ready
// before the user ever reaches the snowball section, and by Snowball3D itself.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL = "/models/snowball.glb";
let promise = null;

export function loadSnowballModel() {
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    new GLTFLoader().load(
      MODEL,
      (gltf) => resolve(gltf.scene),
      undefined,
      reject
    );
  });
  return promise;
}

// Returns a centered, unit-normalized clone ready to drop into a group.
export function makeSnowballInstance(src) {
  const model = src.clone(true);
  model.traverse((o) => {
    if (o.isMesh || o.isInstancedMesh) o.frustumCulled = false;
  });
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const max = Math.max(size.x, size.y, size.z) || 1;
  const fit = 2 / max;

  model.position.sub(center); // center at origin (model still at native scale)
  const inner = new THREE.Group();
  inner.add(model);
  inner.scale.setScalar(fit);
  return inner;
}
