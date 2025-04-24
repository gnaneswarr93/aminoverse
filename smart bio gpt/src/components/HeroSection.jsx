import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const ProteinModel = ({ pdbUrl }) => {
  try {
    const { scene } = useGLTF(pdbUrl);
    return <primitive object={scene} scale={[0.1, 0.1, 0.1]} />;
  } catch (error) {
    console.error('Error loading 3D model:', error);
    return null;
  }
};

const HeroSection = ({ proteinInfo, pdbUrl }) => {
  const [showModel, setShowModel] = useState(true);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-neon">
        Protein: {proteinInfo?.proteinDescription?.recommendedName?.fullName?.value || 'Unknown'}
      </h2>
      <p className="mt-2 text-gray-400">
        Accession: {proteinInfo?.primaryAccession || 'N/A'}
      </p>
      <div className="mt-4">
        {pdbUrl ? (
          <>
            <div className="mb-4">
              <button
                className={`bg-neon text-black px-4 py-2 rounded mr-2 ${showModel ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setShowModel(true)}
                disabled={showModel}
              >
                Open 3D Model
              </button>
              <button
                className={`bg-red-500 text-white px-4 py-2 rounded ${!showModel ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setShowModel(false)}
                disabled={!showModel}
              >
                Close 3D Model
              </button>
            </div>
            {showModel && (
              <div className="w-full" style={{ height: '400px' }}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <ProteinModel pdbUrl={pdbUrl} />
                  <OrbitControls />
                </Canvas>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No 3D structure available.</p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;