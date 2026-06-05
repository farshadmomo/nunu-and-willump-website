"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { loadSnowballModel, makeSnowballInstance } from "@/lib/snowballModel";

// Vanilla three.js. Mounted once on first approach and kept alive (parent never
// unmounts it, so the GL context is never rebuilt mid-scroll). Reads progressRef
// each frame to roll + grow the ball; activeRef gates the render loop so it does
// zero GL work while off-screen. Scale + pixel ratio capped for big-scale fillrate.
export default function Snowball3D({ progressRef, activeRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let disposed = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(1); // fixed: fewer pixels = less overdraw when big
    const size = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      return [w, h];
    };
    let [w, h] = size();
    const el = renderer.domElement;
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";
    mount.appendChild(el);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 6);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xeaf6ff, 2.4);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7fb4ff, 0.95);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // snow spray
    const COUNT = 420;
    const pos = new Float32Array(COUNT * 3);
    let seed = 0x9e3779b9;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + rand() * 4;
      const a = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(a);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(a);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xcfeaff,
      size: 0.03,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    loadSnowballModel().then((src) => {
      if (disposed) return;
      group.add(makeSnowballInstance(src));
    });

    let spin = 0;
    let last = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      // Off-screen: skip all GL work (still cheap to keep the loop primed so we
      // never pay a restart cost). Reset the clock so dt doesn't jump on return.
      if (activeRef && !activeRef.current) {
        last = performance.now();
        return;
      }
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = progressRef.current ?? 0;

      spin += dt * (0.6 + p * 5);
      group.rotation.x = spin + p * Math.PI * 8;
      group.rotation.z = Math.sin(spin * 0.3) * 0.12;
      group.scale.setScalar(0.85 + p * p * 1.7); // capped growth
      group.position.x = (1 - p) * -1.2;

      points.rotation.y += dt * (0.2 + p * 1.5);
      points.rotation.x += dt * 0.1;
      pMat.opacity = 0.12 + p * 0.4;
      pMat.size = 0.02 + p * 0.045;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      [w, h] = size();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [progressRef, activeRef]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
