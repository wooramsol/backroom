import * as THREE from "three";
import { LIGHT_PANEL_COLOR, LIGHT_PANEL_CORE_BOOST, LIGHT_PANEL_EDGE_DIM } from "./constants.js";

/** Troffer face — bright center, softer edges like a real area diffuser */
export function createLightPanelMaterial() {
  const panelColor = new THREE.Color(LIGHT_PANEL_COLOR);
  return new THREE.ShaderMaterial({
    uniforms: {
      panelColor: { value: panelColor },
      coreBoost: { value: LIGHT_PANEL_CORE_BOOST },
      edgeDim: { value: LIGHT_PANEL_EDGE_DIM },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 panelColor;
      uniform float coreBoost;
      uniform float edgeDim;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float edge = max(abs(p.x), abs(p.y)) * 2.0;
        float soften = mix(edgeDim, coreBoost, 1.0 - smoothstep(0.3, 0.92, edge));
        gl_FragColor = vec4(panelColor * soften, 1.0);
      }
    `,
    toneMapped: false,
  });
}
