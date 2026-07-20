"use client";

import { useEffect, useRef } from "react";

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    mat2 turn = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 7; i++) {
      value += amplitude * noise(p);
      p = turn * p * 2.03 + 0.13;
      amplitude *= 0.48;
    }
    return value;
  }

  float line(vec2 uv, float y, float thickness) {
    return smoothstep(thickness, 0.0, abs(uv.y - y));
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 pointer = (u_pointer - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    float t = u_time;

    float glitchGate = step(0.965, hash21(vec2(floor(t * 2.5), 7.0)));
    float band = step(abs(uv.y - (hash21(vec2(floor(t * 3.0), 2.0)) - 0.5)), 0.025);
    uv.x += glitchGate * band * (hash21(vec2(floor(t * 17.0), uv.y)) - 0.5) * 0.13;

    vec2 p = uv * 1.3;
    p += pointer * 0.09;
    p.x += sin(p.y * 2.6 + t * 0.18) * 0.08;

    float smokeA = fbm(p * 1.9 + vec2(t * 0.055, -t * 0.035));
    float smokeB = fbm((p + smokeA * 0.32) * 3.4 - vec2(t * 0.035, t * 0.06));
    float smokeC = fbm((p - smokeB * 0.2) * 6.2 + t * 0.025);

    float core = exp(-length(uv * vec2(0.75, 1.15)) * 2.15);
    float leftGlow = exp(-length(uv - vec2(-0.45, 0.05)) * 3.1);
    float pointerGlow = exp(-length(uv - pointer) * 4.6);
    float fire = smoothstep(0.48, 0.88, smokeA * 0.65 + smokeB * 0.58);
    float veins = pow(smoothstep(0.58, 0.82, smokeC), 2.8);

    vec3 black = vec3(0.003, 0.002, 0.001);
    vec3 ember = vec3(0.95, 0.16, 0.015);
    vec3 orange = vec3(1.0, 0.36, 0.035);
    vec3 gold = vec3(1.0, 0.68, 0.20);
    vec3 blood = vec3(0.20, 0.012, 0.002);

    vec3 color = black;
    color += mix(blood, ember, smokeB) * fire * 0.62;
    color += orange * veins * 0.11;
    color += ember * core * 0.11;
    color += orange * leftGlow * 0.055;
    color += gold * pointerGlow * 0.025;

    float horizon = line(uv, -0.27 + sin(t * 0.17) * 0.015, 0.0015);
    color += orange * horizon * 0.15;

    float scan = 0.5 + 0.5 * sin(frag.y * 1.6 + t * 5.0);
    color *= 0.96 + scan * 0.025;

    float vignette = smoothstep(1.20, 0.15, length(uv * vec2(0.78, 1.05)));
    color *= 0.22 + vignette * 0.90;

    float pulse = 0.92 + 0.08 * sin(t * 0.55);
    color *= pulse;

    float grain = hash21(frag + fract(t) * 99.0) - 0.5;
    color += grain * 0.021;
    color = pow(max(color, 0.0), vec3(0.88));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function SignatureExperience() {
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const shaderCanvas = shaderCanvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    const name = nameRef.current;
    if (!shaderCanvas || !particleCanvas || !name) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer: PointerState = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const cleanup: Array<() => void> = [];
    const animationFrames: number[] = [];

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth;
      pointer.targetY = 1 - event.clientY / window.innerHeight;

      const visualX = (event.clientX / window.innerWidth - 0.5) * 18;
      const visualY = (event.clientY / window.innerHeight - 0.5) * 11;
      name.style.setProperty("--rx", `${-visualY}deg`);
      name.style.setProperty("--ry", `${visualX}deg`);
      name.style.setProperty("--mx", `${visualX * 0.48}px`);
      name.style.setProperty("--my", `${visualY * 0.48}px`);
    };

    const onPointerLeave = () => {
      pointer.targetX = 0.5;
      pointer.targetY = 0.5;
      name.style.setProperty("--rx", "0deg");
      name.style.setProperty("--ry", "0deg");
      name.style.setProperty("--mx", "0px");
      name.style.setProperty("--my", "0px");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    cleanup.push(() => window.removeEventListener("pointermove", onPointerMove));
    cleanup.push(() => document.documentElement.removeEventListener("pointerleave", onPointerLeave));

    const gl = shaderCanvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (gl) {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

      if (vertexShader && fragmentShader) {
        const program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vertexShader);
          gl.attachShader(program, fragmentShader);
          gl.linkProgram(program);

          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
              gl.STATIC_DRAW,
            );

            gl.useProgram(program);
            const position = gl.getAttribLocation(program, "a_position");
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

            const resolution = gl.getUniformLocation(program, "u_resolution");
            const pointerUniform = gl.getUniformLocation(program, "u_pointer");
            const time = gl.getUniformLocation(program, "u_time");
            const start = performance.now();

            const resizeShader = () => {
              const dpr = Math.min(window.devicePixelRatio || 1, 2);
              const width = Math.floor(window.innerWidth * dpr);
              const height = Math.floor(window.innerHeight * dpr);
              if (shaderCanvas.width !== width || shaderCanvas.height !== height) {
                shaderCanvas.width = width;
                shaderCanvas.height = height;
                gl.viewport(0, 0, width, height);
              }
            };

            const renderShader = (now: number) => {
              resizeShader();
              pointer.x += (pointer.targetX - pointer.x) * 0.045;
              pointer.y += (pointer.targetY - pointer.y) * 0.045;

              gl.uniform2f(resolution, shaderCanvas.width, shaderCanvas.height);
              gl.uniform2f(pointerUniform, pointer.x, pointer.y);
              gl.uniform1f(time, reducedMotion ? 0 : (now - start) / 1000);
              gl.drawArrays(gl.TRIANGLES, 0, 6);

              if (!reducedMotion) animationFrames.push(requestAnimationFrame(renderShader));
            };

            renderShader(performance.now());
            window.addEventListener("resize", resizeShader);
            cleanup.push(() => window.removeEventListener("resize", resizeShader));
          }
        }
      }
    }

    const context = particleCanvas.getContext("2d");
    if (context) {
      type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; heat: number };
      let particles: Particle[] = [];

      const resizeParticles = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        particleCanvas.width = Math.floor(window.innerWidth * dpr);
        particleCanvas.height = Math.floor(window.innerHeight * dpr);
        particleCanvas.style.width = `${window.innerWidth}px`;
        particleCanvas.style.height = `${window.innerHeight}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(110, Math.max(48, Math.floor(window.innerWidth / 14)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.23,
          vy: -Math.random() * 0.28 - 0.025,
          size: Math.random() * 1.6 + 0.25,
          alpha: Math.random() * 0.5 + 0.08,
          heat: Math.random(),
        }));
      };

      const renderParticles = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];
          if (!reducedMotion) {
            particle.x += particle.vx + Math.sin(particle.y * 0.009) * 0.04;
            particle.y += particle.vy;
          }

          if (particle.x < -20) particle.x = window.innerWidth + 20;
          if (particle.x > window.innerWidth + 20) particle.x = -20;
          if (particle.y < -30) {
            particle.y = window.innerHeight + 30;
            particle.x = Math.random() * window.innerWidth;
          }

          const red = 255;
          const green = Math.floor(70 + particle.heat * 85);
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(${red}, ${green}, 10, ${particle.alpha})`;
          context.shadowBlur = 12;
          context.shadowColor = `rgba(255, 80, 0, ${particle.alpha})`;
          context.fill();
          context.shadowBlur = 0;

          for (let next = index + 1; next < particles.length; next += 1) {
            const other = particles[next];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 90) {
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.strokeStyle = `rgba(255, 72, 0, ${(1 - distance / 90) * 0.055})`;
              context.lineWidth = 0.5;
              context.stroke();
            }
          }
        }

        if (!reducedMotion) animationFrames.push(requestAnimationFrame(renderParticles));
      };

      resizeParticles();
      renderParticles();
      window.addEventListener("resize", resizeParticles);
      cleanup.push(() => window.removeEventListener("resize", resizeParticles));
    }

    return () => {
      animationFrames.forEach(cancelAnimationFrame);
      cleanup.forEach((fn) => fn());
    };
  }, []);

  return (
    <main className="signature-stage">
      <canvas ref={shaderCanvasRef} className="shader-canvas" aria-hidden="true" />
      <canvas ref={particleCanvasRef} className="particle-canvas" aria-hidden="true" />
      <div className="flare flare-a" aria-hidden="true" />
      <div className="flare flare-b" aria-hidden="true" />
      <div className="grid" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <section className="name-shell" aria-label="Renan Teixeira">
        <h1 ref={nameRef} className="name" data-text="RENAN TEIXEIRA">
          <span className="name-line name-line-primary" data-text="RENAN">RENAN</span>
          <span className="name-line name-line-secondary" data-text="TEIXEIRA">TEIXEIRA</span>
        </h1>
      </section>
    </main>
  );
}
