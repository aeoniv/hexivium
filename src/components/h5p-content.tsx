
'use client';

import React, { useEffect, useRef } from 'react';

interface H5PContentProps {
  embedUrl: string;
  resizerUrl: string;
}

export function H5PContent({ embedUrl, resizerUrl }: H5PContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The resizer script needs to be added to the document head to work correctly.
    const script = document.createElement('script');
    script.src = resizerUrl;
    script.charset = 'UTF-8';
    script.async = true;

    // Avoid adding duplicate scripts
    const existingScript = document.querySelector(`script[src="${resizerUrl}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
    }

    return () => {
      // Clean up the script when the component unmounts if it's no longer needed elsewhere.
      // For simplicity, we'll leave it, but in a larger app, you might implement reference counting.
    };
  }, [resizerUrl]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <iframe
        src={embedUrl}
        aria-label="H5P Content"
        width="100%"
        height="637"
        frameBorder="0"
        allowFullScreen
        allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
        className="w-full rounded-lg"
        style={{ minHeight: '637px' }}
      ></iframe>
    </div>
  );
}
