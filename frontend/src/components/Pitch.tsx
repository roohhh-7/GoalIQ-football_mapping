"use client";
import { useState, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Layers, Move, Rotate3d, Focus } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, Html, Line, Environment } from '@react-three/drei';

const PITCH_WIDTH = 120;
const PITCH_HEIGHT = 80;

function Goal3D({ x, isLeft }: { x: number, isLeft: boolean }) {
  const postRadius = 0.2;
  const goalHeight = 2.66;
  const goalWidth = 8;
  const yStart = 40 - goalWidth / 2;
  const yEnd = 40 + goalWidth / 2;
  
  const color = "#ffffff";
  const netColor = "#8B928D";

  return (
    <group>
      {/* Post 1 */}
      <mesh position={[x, goalHeight / 2, yStart]}>
        <cylinderGeometry args={[postRadius, postRadius, goalHeight, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Post 2 */}
      <mesh position={[x, goalHeight / 2, yEnd]}>
        <cylinderGeometry args={[postRadius, postRadius, goalHeight, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[x, goalHeight, 40]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[postRadius, postRadius, goalWidth + postRadius * 2, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Net lines */}
      <Line points={[
        [x, goalHeight, yStart],
        [isLeft ? x - 2 : x + 2, 0, yStart]
      ]} color={netColor} opacity={0.5} transparent lineWidth={1} />
      <Line points={[
        [x, goalHeight, yEnd],
        [isLeft ? x - 2 : x + 2, 0, yEnd]
      ]} color={netColor} opacity={0.5} transparent lineWidth={1} />
      <Line points={[
        [isLeft ? x - 2 : x + 2, 0, yStart],
        [isLeft ? x - 2 : x + 2, 0, yEnd]
      ]} color={netColor} opacity={0.5} transparent lineWidth={1} />
      <Line points={[
        [x, goalHeight, yStart],
        [x, goalHeight, yEnd],
        [isLeft ? x - 2 : x + 2, 0, yEnd],
        [isLeft ? x - 2 : x + 2, 0, yStart],
        [x, goalHeight, yStart]
      ]} color={netColor} opacity={0.2} transparent lineWidth={0.5} />
    </group>
  );
}

function PitchMarkings() {
  const lineColor = '#ffffff';

  const pointsOutline: [number, number, number][] = [
    [0, 0, 0], [PITCH_WIDTH, 0, 0], [PITCH_WIDTH, 0, PITCH_HEIGHT], [0, 0, PITCH_HEIGHT], [0, 0, 0]
  ];
  const pointsHalfway: [number, number, number][] = [[PITCH_WIDTH/2, 0, 0], [PITCH_WIDTH/2, 0, PITCH_HEIGHT]];
  
  const centerCircle: [number, number, number][] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    centerCircle.push([PITCH_WIDTH/2 + Math.cos(angle)*9.15, 0, PITCH_HEIGHT/2 + Math.sin(angle)*9.15]);
  }
  
  const penBoxLeft: [number, number, number][] = [
    [0, 0, (PITCH_HEIGHT - 40.32)/2],
    [16.5, 0, (PITCH_HEIGHT - 40.32)/2],
    [16.5, 0, (PITCH_HEIGHT + 40.32)/2],
    [0, 0, (PITCH_HEIGHT + 40.32)/2]
  ];

  const sixYardLeft: [number, number, number][] = [
    [0, 0, (PITCH_HEIGHT - 18.32)/2],
    [5.5, 0, (PITCH_HEIGHT - 18.32)/2],
    [5.5, 0, (PITCH_HEIGHT + 18.32)/2],
    [0, 0, (PITCH_HEIGHT + 18.32)/2]
  ];

  const penBoxRight: [number, number, number][] = [
    [PITCH_WIDTH, 0, (PITCH_HEIGHT - 40.32)/2],
    [PITCH_WIDTH - 16.5, 0, (PITCH_HEIGHT - 40.32)/2],
    [PITCH_WIDTH - 16.5, 0, (PITCH_HEIGHT + 40.32)/2],
    [PITCH_WIDTH, 0, (PITCH_HEIGHT + 40.32)/2]
  ];

  const sixYardRight: [number, number, number][] = [
    [PITCH_WIDTH, 0, (PITCH_HEIGHT - 18.32)/2],
    [PITCH_WIDTH - 5.5, 0, (PITCH_HEIGHT - 18.32)/2],
    [PITCH_WIDTH - 5.5, 0, (PITCH_HEIGHT + 18.32)/2],
    [PITCH_WIDTH, 0, (PITCH_HEIGHT + 18.32)/2]
  ];

  return (
    <group>
      <Line points={pointsOutline} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      <Line points={pointsHalfway} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      <Line points={centerCircle} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      <Line points={penBoxLeft} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      <Line points={sixYardLeft} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      <Line points={penBoxRight} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      <Line points={sixYardRight} color={lineColor} lineWidth={1.5} opacity={0.3} transparent />
      
      {/* Center dot */}
      <mesh position={[PITCH_WIDTH/2, 0, PITCH_HEIGHT/2]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.3} />
      </mesh>
      {/* Pen dot left */}
      <mesh position={[11, 0, PITCH_HEIGHT/2]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.3} />
      </mesh>
      {/* Pen dot right */}
      <mesh position={[PITCH_WIDTH-11, 0, PITCH_HEIGHT/2]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.3} />
      </mesh>
      
      {/* Goals */}
      <Goal3D x={0} isLeft={true} />
      <Goal3D x={PITCH_WIDTH} isLeft={false} />
    </group>
  );
}

function Shots({ shots, setHoveredShot, setTargetPos }) {
  return (
    <group>
      {shots.map((shot, idx) => {
        const isGoal = shot.is_goal === 1;
        const color = isGoal ? '#5FAE63' : '#8B928D';
        const xgSize = Math.max(0.5, shot.statsbomb_xg * 3);
        
        return (
          <mesh 
            key={idx} 
            position={[shot.x, xgSize/2, shot.y]}
            onClick={(e) => {
              e.stopPropagation();
              // When clicked, set the camera's orbit pivot point to this shot
              setTargetPos([shot.x, 0, shot.y]);
            }}
            onPointerOver={(e) => { 
              e.stopPropagation(); 
              setHoveredShot(shot); 
              document.body.style.cursor = 'pointer'; 
            }}
            onPointerOut={(e) => { 
              setHoveredShot(null); 
              document.body.style.cursor = 'default'; 
            }}
          >
            <sphereGeometry args={[xgSize, 32, 32]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

function Tooltip({ shot }) {
  if (!shot) return null;
  const xgSize = Math.max(0.5, shot.statsbomb_xg * 3);
  
  return (
    <Html position={[shot.x, xgSize + 1, shot.y]} zIndexRange={[100, 0]}>
      <div 
        className="bg-surface border border-border-subtle text-text-main text-xs p-3 rounded-lg shadow-xl w-48 absolute pointer-events-none"
        style={{ transform: 'translate(-110%, -50%)' }}
      >
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-surface border-t border-r border-border-subtle transform rotate-45" />
        <div className="font-bold mb-1 border-b border-border-subtle pb-1">{shot.player}</div>
        <div className="flex justify-between mt-1">
          <span className="text-text-sec">Team:</span>
          <span className="font-medium">{shot.team}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-sec">Result:</span>
          <span className="font-bold" style={{ color: shot.is_goal === 1 ? 'var(--color-pitch-success)' : 'var(--color-pitch-missed)' }}>
            {shot.is_goal === 1 ? 'Goal' : 'Miss/Saved'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-sec">Expected (xG):</span>
          <span className="font-medium" style={{ color: 'var(--color-pitch-high-xg)' }}>{shot.statsbomb_xg.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-sec">Body Part:</span>
          <span className="font-medium">{shot.shot_body_part}</span>
        </div>
        {shot.season && (
          <div className="flex justify-between">
            <span className="text-text-sec">Year:</span>
            <span className="font-medium">{shot.season}</span>
          </div>
        )}
        {shot.play_pattern && (
          <div className="flex justify-between">
            <span className="text-text-sec">Context:</span>
            <span className="font-medium text-brand">{shot.play_pattern}</span>
          </div>
        )}
      </div>
    </Html>
  );
}

export default function Pitch({ shots }) {
  const [hoveredShot, setHoveredShot] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewMode, setViewMode] = useState('3d');
  
  // The point the camera looks at and orbits around. Defaults to pitch center.
  const [targetPos, setTargetPos] = useState<[number, number, number]>([60, 0, 40]);

  const renderControls = () => (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      <button 
        onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
        className="p-1.5 px-2.5 flex items-center gap-1.5 text-[10px] sm:text-xs font-medium bg-surface/80 hover:bg-surface-hover rounded-md shadow-sm border border-border-subtle backdrop-blur-sm transition-colors text-text-sec"
      >
        <Layers className="w-3.5 h-3.5" />
        {viewMode === '3d' ? '2D View' : '3D View'}
      </button>
      <button 
        onClick={() => setIsMaximized(!isMaximized)}
        className="p-1.5 bg-surface/80 hover:bg-surface-hover rounded-md shadow-sm border border-border-subtle backdrop-blur-sm transition-colors text-text-sec"
      >
        {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  const renderInstructions = () => {
    if (viewMode !== '3d') return null;
    return (
      <div 
        className="absolute top-2 left-2 z-20 bg-surface/80 border border-border-subtle rounded-md p-2 px-2.5 text-text-sec shadow-sm backdrop-blur-sm pointer-events-none flex flex-col gap-1"
        style={{ transform: 'scale(0.8)', transformOrigin: 'top left', fontSize: '10px' }}
      >
        <div className="font-semibold text-text-main" style={{ fontSize: '11px', marginBottom: '2px' }}>3D Controls</div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5"><Move className="w-2.5 h-2.5" /> <b>Pan:</b> Left Click + Drag</span>
          <span className="flex items-center gap-1.5"><Rotate3d className="w-2.5 h-2.5" /> <b>Rotate:</b> Right Click + Drag</span>
          <span className="flex items-center gap-1.5"><Maximize2 className="w-2.5 h-2.5" /> <b>Zoom:</b> Scroll</span>
          <span className="flex items-center gap-1.5"><Focus className="w-2.5 h-2.5" /> <b>Focus:</b> Click a shot</span>
        </div>
      </div>
    );
  };

  const renderPitchContent2D = () => (
    <>
      {renderControls()}
      <svg 
        viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <g strokeWidth="0.5" fill="none" style={{ stroke: 'var(--color-border-hover)' }}>
          <rect x="0" y="0" width={PITCH_WIDTH} height={PITCH_HEIGHT} />
          <line x1={PITCH_WIDTH / 2} y1="0" x2={PITCH_WIDTH / 2} y2={PITCH_HEIGHT} />
          <circle cx={PITCH_WIDTH / 2} cy={PITCH_HEIGHT / 2} r="9.15" />
          <circle cx={PITCH_WIDTH / 2} cy={PITCH_HEIGHT / 2} r="0.5" style={{ fill: 'var(--color-border-hover)' }} />
          <rect x="0" y={(PITCH_HEIGHT - 40.32) / 2} width="16.5" height="40.32" />
          <rect x="0" y={(PITCH_HEIGHT - 18.32) / 2} width="5.5" height="18.32" />
          <circle cx="11" cy={PITCH_HEIGHT / 2} r="0.5" style={{ fill: 'var(--color-border-hover)' }} />
          <path d="M 16.5 31 A 9.15 9.15 0 0 1 16.5 49" />
          <rect x={PITCH_WIDTH - 16.5} y={(PITCH_HEIGHT - 40.32) / 2} width="16.5" height="40.32" />
          <rect x={PITCH_WIDTH - 5.5} y={(PITCH_HEIGHT - 18.32) / 2} width="5.5" height="18.32" />
          <circle cx={PITCH_WIDTH - 11} cy={PITCH_HEIGHT / 2} r="0.5" style={{ fill: 'var(--color-border-hover)' }} />
          <path d="M 103.5 31 A 9.15 9.15 0 0 0 103.5 49" />
        </g>
      </svg>

      <svg 
        viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`} 
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {shots.map((shot, idx) => {
          const isGoal = shot.is_goal === 1;
          const xgSize = Math.max(0.8, shot.statsbomb_xg * 4);
          return (
            <motion.circle
              key={idx}
              cx={shot.x}
              cy={shot.y}
              r={xgSize}
              fill={isGoal ? 'var(--color-pitch-success)' : 'var(--color-pitch-missed)'}
              stroke={isGoal ? 'var(--color-pitch-high-xg)' : 'var(--color-pitch-blocked)'}
              strokeWidth={0.2}
              className="cursor-pointer drop-shadow-sm opacity-80"
              onMouseEnter={() => setHoveredShot(shot)}
              onMouseLeave={() => setHoveredShot(null)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ delay: idx * 0.005 }}
              whileHover={{ scale: 2, opacity: 1, strokeWidth: 0.5 }}
            />
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredShot && (
          <motion.div
            initial={{ opacity: 0, x: "-110%", y: "-40%", scale: 0.95 }}
            animate={{ opacity: 1, x: "-110%", y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: "-110%", y: "-40%", scale: 0.95 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: `${(hoveredShot.x / PITCH_WIDTH) * 100}%`,
              top: `${(hoveredShot.y / PITCH_HEIGHT) * 100}%`,
              marginLeft: '-15px'
            }}
          >
            <div className="bg-surface border border-border-subtle text-text-main text-xs p-3 rounded-lg shadow-xl w-48 relative">
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-surface border-t border-r border-border-subtle transform rotate-45" />
              <div className="font-bold mb-1 border-b border-border-subtle pb-1">{hoveredShot.player}</div>
              <div className="flex justify-between mt-1">
                <span className="text-text-sec">Team:</span>
                <span className="font-medium">{hoveredShot.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-sec">Result:</span>
                <span className="font-bold" style={{ color: hoveredShot.is_goal === 1 ? 'var(--color-pitch-success)' : 'var(--color-pitch-missed)' }}>
                  {hoveredShot.is_goal === 1 ? 'Goal' : 'Miss/Saved'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-sec">Expected (xG):</span>
                <span className="font-medium" style={{ color: 'var(--color-pitch-high-xg)' }}>{hoveredShot.statsbomb_xg.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-sec">Body Part:</span>
                <span className="font-medium">{hoveredShot.shot_body_part}</span>
              </div>
              {hoveredShot.season && (
                <div className="flex justify-between">
                  <span className="text-text-sec">Year:</span>
                  <span className="font-medium">{hoveredShot.season}</span>
                </div>
              )}
              {hoveredShot.play_pattern && (
                <div className="flex justify-between">
                  <span className="text-text-sec">Context:</span>
                  <span className="font-medium text-brand">{hoveredShot.play_pattern}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const renderPitchContent3D = () => (
    <>
      {renderControls()}
      {renderInstructions()}

      <Canvas 
        camera={{ position: [60, 60, 100], fov: 45 }}
        className="w-full h-full bg-surface"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 50, 20]} intensity={1.2} castShadow />
        <Environment preset="city" />

        <OrbitControls 
          makeDefault
          target={targetPos}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={150}
          enablePan={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,     // 1 finger: Pan
            RIGHT: THREE.MOUSE.ROTATE, // 2 fingers: Rotate
            MIDDLE: THREE.MOUSE.DOLLY  // 3 fingers/scroll wheel: Zoom
          }}
        />

        {/* 3D Grass Plane & Track */}
        <mesh position={[60, -0.2, 40]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[160, 120]} />
          <meshStandardMaterial color="#0c120e" roughness={1} />
        </mesh>
        <mesh position={[60, -0.1, 40]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[130, 90]} />
          <meshStandardMaterial color="#1a2e20" roughness={0.9} />
        </mesh>

        <PitchMarkings />
        <Shots shots={shots} setHoveredShot={setHoveredShot} setTargetPos={setTargetPos} />
        <Tooltip shot={hoveredShot} />
      </Canvas>
    </>
  );

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm p-4 md:p-12 flex items-center justify-center">
        <div className="relative w-full max-w-[1600px] aspect-[120/80] bg-surface rounded-xl border border-border-subtle shadow-2xl overflow-hidden">
          {viewMode === '3d' ? renderPitchContent3D() : renderPitchContent2D()}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[120/80] bg-surface rounded-md border border-border-subtle shadow-sm overflow-hidden">
      {viewMode === '3d' ? renderPitchContent3D() : renderPitchContent2D()}
    </div>
  );
}
