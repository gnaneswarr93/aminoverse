import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';

// Extend THREE objects for React Three Fiber at the module level
import { extend } from '@react-three/fiber';
extend({ Points: THREE.Points, PointsMaterial: THREE.PointsMaterial });

const ProteinModel = ({ pdbUrl }) => {
  const [geometry, setGeometry] = useState(null);
  const [colors, setColors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Loading PDB from:', pdbUrl);
    setLoading(true);
    setError(null);

    const loader = new PDBLoader();
    loader.load(
      pdbUrl,
      (pdb) => {
        console.log('PDB loaded successfully:', pdb);
        const geometry = pdb.geometryAtoms;
        const positions = geometry.attributes.position.array;
        const colorArray = new Float32Array(positions.length);

        const atomTypes = pdb.json.atoms.map((atom) => atom[4]);
        for (let i = 0; i < atomTypes.length; i++) {
          const atom = atomTypes[i];
          let color;
          switch (atom) {
            case 'C':
              color = new THREE.Color(0x00ff00); // Green
              break;
            case 'N':
              color = new THREE.Color(0x0000ff); // Blue
              break;
            case 'O':
              color = new THREE.Color(0xff0000); // Red
              break;
            default:
              color = new THREE.Color(0xffffff); // White
          }
          colorArray[i * 3] = color.r;
          colorArray[i * 3 + 1] = color.g;
          colorArray[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        setGeometry(geometry);
        setColors(true);
        setLoading(false);
      },
      (progress) => console.log('PDB loading progress:', (progress.loaded / progress.total) * 100, '%'),
      (error) => {
        console.error('PDB loading failed:', error);
        setError('Failed to load 3D model. Check the PDB file or network.');
        setLoading(false);
      }
    );
  }, [pdbUrl]);

  if (loading) return <mesh><boxGeometry /><meshBasicMaterial color="gray" /></mesh>;
  if (error || !geometry) return <mesh><boxGeometry /><meshBasicMaterial color="red" /></mesh>;

  return (
    <points>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial
        attach="material"
        color="white"
        size={0.5}
        sizeAttenuation={true}
        vertexColors={colors}
      />
    </points>
  );
};

const HeroSection = ({ proteinInfo, pdbUrl }) => {
  const [showModel, setShowModel] = useState(false);
  const defaultPdbUrl = '/pdb/AF-P38398-F1-model_v4.pdb';

  useEffect(() => {
    console.log('HeroSection pdbUrl:', pdbUrl || defaultPdbUrl);
  }, [pdbUrl]);

  const effectivePdbUrl = pdbUrl || defaultPdbUrl;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-neon mb-2">
        Protein: {proteinInfo?.proteinDescription?.recommendedName?.fullName?.value || 'Unknown'}
      </h2>
      <p className="text-gray-400 mb-4">
        Accession: {proteinInfo?.primaryAccession || 'N/A'}
      </p>
      <div className="mb-4 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded text-black ${showModel ? 'bg-gray-500 cursor-not-allowed' : 'bg-neon hover:bg-neon-dark'}`}
          onClick={() => setShowModel(true)}
          disabled={showModel}
        >
          Open 3D Model
        </button>
        <button
          className={`px-4 py-2 rounded text-white ${!showModel ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
          onClick={() => setShowModel(false)}
          disabled={!showModel}
        >
          Close 3D Model
        </button>
      </div>
      {showModel && (
        <div className="w-[600px] h-[400px] mx-auto" style={{ width: '600px', height: '400px' }}>
          <Canvas
            camera={{ position: [0, 0, 20], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
            eventsEnabled={false} // Temporarily disable pointer events to avoid 'target is null'
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.0} />
              <directionalLight position={[10, 10, 10]} intensity={1.5} />
              <ProteinModel pdbUrl={effectivePdbUrl} />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default HeroSection;