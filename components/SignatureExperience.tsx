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
    float amplitude = 0.52;
    mat2 transform = mat2(0.80, 0.60, -0.60, 0.80);

    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = transform * p * 2.03 + 0.17;
      amplitude *= 0.48;
    }

    return value;
  }

  float stars(vec2 uv, float scale, float threshold, float time) {
    vec2 grid = fract(uv * scale) - 0.5;
    vec2 id = floor(uv * scale);
    float random = hash21(id);
    float star = smoothstep(0.055, 0.0, length(grid));
    star *= smoothstep(threshold, 1.0, random);
    star *= 0.65 + 0.35 * sin(time * (1.0 + random * 3.0) + random * 20.0);
    return star;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 pointer = (u_pointer - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

    float time = u_time * 0.052;
    float angle = time * 0.23;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    vec2 p = rotation * (uv * 1.12);
    p += pointer * 0.12;

    float cloudA = fbm(p * 2.05 + vec2(time, -time * 0.55));
    float cloudB = fbm(p * 3.65 - vec2(time * 0.72, time));
    float cloudC = fbm((p + cloudA * 0.23) * 5.4);

    vec3 black = vec3(0.004, 0.007, 0.012);
    vec3 blue = vec3(0.02, 0.14, 0.34);
    vec3 cyan = vec3(0.02, 0.62, 0.78);
    vec3 violet = vec3(0.26, 0.06, 0.47);

    float nebula = smoothstep(0.35, 0.91, cloudA * 0.72 + cloudB * 0.46);
    float veins = pow(smoothstep(0.55, 0.83, cloudC), 2.3);
    float centerGlow = exp(-length(uv - vec2(0.22, 0.02)) * 2.5);
    float pointerGlow = exp(-length(uv - pointer) * 3.8);

    vec3 color = black;
    color += mix(blue, violet, cloudB) * nebula * 0.72;
    color += cyan * veins * 0.14;
    color += vec3(0.05, 0.17, 0.42) * centerGlow * 0.34;
    color += cyan * pointerGlow * 0.025;

    float starField = stars(uv + vec2(time * 0.018, 0.0), 58.0, 0.985, u_time);
    starField += stars(uv * 1.21 - vec2(time * 0.011, 0.0), 96.0, 0.992, u_time) * 0.62;
    color += vec3(starField) * vec3(0.58, 0.82, 1.0);

    float vignette = smoothstep(1.22, 0.16, length(uv * vec2(0.88, 1.0)));
    color *= 0.28 + vignette * 0.86;

    float grain = hash21(frag + fract(u_time) * 100.0) - 0.5;
    color += grain * 0.016;
    color = pow(color, vec3(0.9));

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

      const visualX = (event.clientX / window.innerWidth - 0.5) * 16;
      const visualY = (event.clientY / window.innerHeight - 0.5) * 10;
      name.style.setProperty("--rx", `${-visualY}deg`);
      name.style.setProperty("--ry", `${visualX}deg`);
      name.style.setProperty("--mx", `${visualX * 0.42}px`);
      name.style.setProperty("--my", `${visualY * 0.42}px`);
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
              pointer.x += (pointer.targetX - pointer.x) * 0.04;
              pointer.y += (pointer.targetY - pointer.y) * 0.04;

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
      type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };
      let particles: Particle[] = [];

      const resizeParticles = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        particleCanvas.width = Math.floor(window.innerWidth * dpr);
        particleCanvas.height = Math.floor(window.innerHeight * dpr);
        particleCanvas.style.width = `${window.innerWidth}px`;
        particleCanvas.style.height = `${window.innerHeight}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(82, Math.max(34, Math.floor(window.innerWidth / 18)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          size: Math.random() * 1.25 + 0.25,
          alpha: Math.random() * 0.45 + 0.12,
        }));
      };

      const renderParticles = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];
          if (!reducedMotion) {
            particle.x += particle.vx;
            particle.y += particle.vy;
          }

          if (particle.x < -20) particle.x = window.innerWidth + 20;
          if (particle.x > window.innerWidth + 20) particle.x = -20;
          if (particle.y < -20) particle.y = window.innerHeight + 20;
          if (particle.y > window.innerHeight + 20) particle.y = -20;

          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(160, 224, 255, ${particle.alpha})`;
          context.fill();

          for (let next = index + 1; next < particles.length; next += 1) {
            const other = particles[next];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 112) {
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.strokeStyle = `rgba(84, 210, 255, ${(1 - distance / 112) * 0.06})`;
              context.lineWidth = 0.55;
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

      <div className="aurora aurora-a" aria-hidden="true" />
      <div className="aurora aurora-b" aria-hidden="true" />
      <div className="grid" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <section className="name-shell" aria-label="Renan Teixeira">
        <h1 ref={nameRef} className="name" data-text="RENAN TEIXEIRA">
          <span className="name-line name-line-primary">RENAN</span>
          <span className="name-line name-line-secondary">TEIXEIRA</span>
        </h1>
      </section>
    </main>
  );
}
