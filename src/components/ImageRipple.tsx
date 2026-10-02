"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function RippleImage() {
  const texture = useTexture("/RU_PEP_Logo.png");

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { viewport, pointer } = useThree();

  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const previousMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const velocity = useRef(0);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const targetX = pointer.x * 0.5 + 0.5;
    const targetY = pointer.y * 0.5 + 0.5;

    mouse.current.x +=
      (targetX - mouse.current.x) * 0.12;

    mouse.current.y +=
      (targetY - mouse.current.y) * 0.12;

    const dx =
      mouse.current.x -
      previousMouse.current.x;

    const dy =
      mouse.current.y -
      previousMouse.current.y;

    const movement = Math.sqrt(
      dx * dx + dy * dy,
    );

    velocity.current += movement * 12;
    velocity.current *= 0.90;

    previousMouse.current.copy(mouse.current);

    materialRef.current.uniforms.uMouse.value.copy(
      mouse.current,
    );

    materialRef.current.uniforms.uVelocity.value =
      velocity.current;

    time.current += delta;

    materialRef.current.uniforms.uTime.value =
      time.current;
  });

  const imageWidth = Math.min(
    viewport.width * 0.55,
    4.5,
  );

  const imageHeight = imageWidth * 0.75;

  return (
    <mesh
      scale={[
        imageWidth,
        imageHeight,
        1,
      ]}
    >
      <planeGeometry args={[1, 1]} />

      <shaderMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        uniforms={{
          uTexture: {
            value: texture,
          },

          uMouse: {
            value: new THREE.Vector2(
              0.5,
              0.5,
            ),
          },

          uTime: {
            value: 0,
          },

          uVelocity: {
            value: 0,
          },
        }}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform vec2 uMouse;
          uniform float uTime;
          uniform float uVelocity;

          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            float distanceToMouse =
              distance(
                uv,
                uMouse
              );

            float rippleRadius =
              mod(
                uTime * 0.35,
                1.0
              );

            float ripple =
              1.0 -
              smoothstep(
                0.0,
                0.22,
                abs(
                  distanceToMouse -
                  rippleRadius
                )
              );

            float strength =
              ripple *
              min(
                uVelocity,
                1.5
              ) *
              0.045;

            vec2 direction =
              normalize(
                uv -
                uMouse +
                vec2(0.0001)
              );

            uv +=
              direction *
              strength;

            uv.x +=
              sin(
                uv.y * 20.0 +
                uTime * 3.0
              ) *
              strength *
              0.2;

            uv.y +=
              cos(
                uv.x * 20.0 +
                uTime * 3.0
              ) *
              strength *
              0.2;

            uv = clamp(
              uv,
              0.001,
              0.999
            );

            vec4 color =
              texture2D(
                uTexture,
                uv
              );

            /*
             * Preserve the PNG's alpha channel.
             */
            gl_FragColor = vec4(
              color.rgb,
              color.a
            );
          }
        `}
      />
    </mesh>
  );
}

export default function ImageRipple() {
  return (
    <div className="h-[260px] w-full bg-transparent">
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 10],
          zoom: 70,
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
        }}
        dpr={[1, 2]}
      >
        <RippleImage />
      </Canvas>
    </div>
  );
}

