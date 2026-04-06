import { useEffect, useRef } from 'react';

import { DialogComponent } from './Dialog';

function DocumentContent({ image }: { image: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (imgRef.current) {
        imgRef.current.style.opacity = '1';
      }
    }, 0);
  }, []);

  return (
    <img
      ref={imgRef}
      src={image}
      alt="Dialog Image"
      style={{ width: '50vmin', height: '50vmin', opacity: 0, transition: 'opacity 5s ease' }}
    />
  );
}

type ImageDialogProps = {
  triggerComponent: React.ReactNode;
  imageDataUrl: string;
};

export function ImageDialog({ triggerComponent, imageDataUrl }: ImageDialogProps) {
  return (
    <DialogComponent
      triggerComponent={triggerComponent}
      content={<DocumentContent image={imageDataUrl} />}
    />
  );
}
