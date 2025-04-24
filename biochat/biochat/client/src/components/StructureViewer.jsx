import React, { useEffect, useRef } from 'react';

function StructureViewer({ pdbUrl }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (pdbUrl && viewerRef.current) {
      const element = viewerRef.current;
      const config = { backgroundColor: 'white' };
      const viewer = $3Dmol.createViewer(element, config);
      fetch(pdbUrl)
        .then((res) => res.text())
        .then((data) => {
          viewer.addModel(data, 'pdb');
          viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          viewer.zoomTo();
          viewer.render();
        });
    }
  }, [pdbUrl]);

  return <div ref={viewerRef} style={{ width: '100%', height: '300px' }} />;
}

export default StructureViewer;