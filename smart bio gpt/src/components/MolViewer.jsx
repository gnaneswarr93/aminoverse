// src/components/MolViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';

const MolViewer = ({ pdbUrl }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!pdbUrl) return;

    const element = viewerRef.current;
    if (!element) return;

    // Clear previous viewer if exists
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    const config = { backgroundColor: 'black' };
    const viewer = $3Dmol.createViewer(element, config);

    $3Dmol.download(pdbUrl, viewer, {}, () => {
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      viewer.zoomTo();
      viewer.render();
    });
  }, [pdbUrl]);

  return (
    <div
      ref={viewerRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MolViewer;
