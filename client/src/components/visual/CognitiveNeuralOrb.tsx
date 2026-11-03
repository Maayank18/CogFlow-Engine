import React, { useEffect, useRef } from 'react';

export type OrbCognitiveMode = 'flow' | 'overload' | 'boredom';

interface CognitiveNeuralOrbProps {
  mode?: OrbCognitiveMode;
  className?: string;
  size?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  theta: number;
  phi: number;
}

export const CognitiveNeuralOrb: React.FC<CognitiveNeuralOrbProps> = ({
  mode = 'flow',
  className = '',
  size = 420,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Retina display scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Generate 3D Spherical Fibonacci Lattice
    const numPoints = 280;
    const sphereRadius = size * 0.35;
    const points: Point3D[] = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numPoints; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        radius: sphereRadius,
        theta,
        phi,
      });
    }

    // Palette configuration per cognitive mode
    const getModeParams = () => {
      switch (mode) {
        case 'overload':
          return {
            speed: 0.035,
            amplitude: 24,
            waveCount: 5,
            colorCore: 'rgba(244, 63, 94, 0.85)',
            colorEdge: 'rgba(251, 146, 60, 0.7)',
            lineColor: 'rgba(244, 63, 94, 0.22)',
            glowColor: 'rgba(244, 63, 94, 0.35)',
            bgGlow: '#e11d48',
          };
        case 'boredom':
          return {
            speed: 0.008,
            amplitude: 10,
            waveCount: 2,
            colorCore: 'rgba(129, 140, 248, 0.75)',
            colorEdge: 'rgba(99, 102, 241, 0.6)',
            lineColor: 'rgba(99, 102, 241, 0.16)',
            glowColor: 'rgba(99, 102, 241, 0.25)',
            bgGlow: '#4f46e5',
          };
        case 'flow':
        default:
          return {
            speed: 0.018,
            amplitude: 16,
            waveCount: 3,
            colorCore: 'rgba(6, 182, 212, 0.9)',
            colorEdge: 'rgba(20, 184, 166, 0.75)',
            lineColor: 'rgba(6, 182, 212, 0.25)',
            glowColor: 'rgba(13, 148, 136, 0.35)',
            bgGlow: '#06b6d4',
          };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = normX * 0.8;
      mouseRef.current.targetY = normY * 0.8;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 1;
      const params = getModeParams();

      // Smooth mouse follow interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const rotX = time * 0.005 + mouseRef.current.y;
      const rotY = time * 0.008 + mouseRef.current.x;

      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;

      // Atmospheric Radial Background Glow inside Canvas
      const ambientGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.2,
        centerX,
        centerY,
        sphereRadius * 1.3
      );
      ambientGlow.addColorStop(0, params.glowColor);
      ambientGlow.addColorStop(0.7, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Transform & Displace 3D Points
      const projectedPoints: Array<{ x: number; y: number; z: number; size: number; alpha: number }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Complex trigonometric topological wave displacement
        const displacement =
          Math.sin(time * params.speed + p.theta * params.waveCount) *
          Math.cos(time * params.speed * 0.7 + p.phi * (params.waveCount + 1)) *
          params.amplitude;

        const currentR = p.radius + displacement;
        const x3d = currentR * Math.sin(p.phi) * Math.cos(p.theta);
        const y3d = currentR * Math.sin(p.phi) * Math.sin(thetaCalc(p.theta, time * params.speed));
        const z3d = currentR * Math.cos(p.phi);

        // 3D Rotations around X and Y axes
        // Y-axis rotation
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x3d * cosY + z3d * sinY;
        const z1 = -x3d * sinY + z3d * cosY;

        // X-axis rotation
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y3d * cosX - z1 * sinX;
        const z2 = y3d * sinX + z1 * cosX;

        // Perspective projection
        const fov = size * 1.2;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        // Normalizing depth (-sphereRadius to +sphereRadius)
        const depthNorm = (z2 + sphereRadius * 1.2) / (sphereRadius * 2.4);
        const alpha = Math.max(0.12, Math.min(1.0, depthNorm));
        const pointSize = Math.max(1.0, (2.4 + (1 - depthNorm) * 2.2) * scale);

        projectedPoints.push({
          x: projX,
          y: projY,
          z: z2,
          size: pointSize,
          alpha,
        });
      }

      // Draw Synaptic Connector Lines between nearby points
      ctx.strokeStyle = params.lineColor;
      ctx.lineWidth = 0.8;
      const connectionDist = size * 0.12;

      for (let i = 0; i < projectedPoints.length; i += 2) {
        const p1 = projectedPoints[i];
        if (p1.z < 0) continue; // Only draw foreground connections for performance

        for (let j = i + 1; j < Math.min(i + 14, projectedPoints.length); j++) {
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * p1.alpha * 0.6;
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes / Glowing Neural Points (Sorted back-to-front)
      projectedPoints.sort((a, b) => a.z - b.z);

      for (const p of projectedPoints) {
        ctx.fillStyle = p.z > 0 ? params.colorCore : params.colorEdge;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra specular spark on frontmost nodes
        if (p.z > sphereRadius * 0.4) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    function thetaCalc(theta: number, offset: number) {
      return theta + offset * 0.5;
    }

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, size]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer ambient blur halo */}
      <div
        className={`absolute -inset-10 rounded-full filter blur-3xl opacity-40 transition-colors duration-700 pointer-events-none ${
          mode === 'overload'
            ? 'bg-gradient-to-tr from-rose-500/40 via-red-500/30 to-amber-500/40'
            : mode === 'boredom'
            ? 'bg-gradient-to-tr from-indigo-500/40 via-purple-500/30 to-blue-500/40'
            : 'bg-gradient-to-tr from-cyan-500/40 via-teal-500/30 to-blue-500/40'
        }`}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 cursor-grab active:cursor-grabbing transition-transform duration-300"
      />
    </div>
  );
};
