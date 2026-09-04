'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Reset when the image set changes (e.g. variation switched). Without this,
  // the index can fall outside the new images array and render a placeholder.
  useEffect(() => {
    setSelectedImage((prev) => (prev < images.length ? prev : 0));
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation in the zoom dialog. Escape is handled by the Dialog.
  useEffect(() => {
    if (!isZoomOpen || images.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isZoomOpen, images.length, handlePrevious, handleNext]);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={() => setIsZoomOpen(true)}
          // Allow keyboard arrow navigation when the gallery has focus.
          tabIndex={images.length > 1 ? 0 : undefined}
          onKeyDown={(e) => {
            if (images.length <= 1) return;
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handlePrevious();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleNext();
            }
          }}
        >
          <Image
            src={images[selectedImage] || '/placeholder.svg'}
            alt={`${productName} — imagen ${selectedImage + 1}`}
            fill
            className="object-cover"
          />

          {/* Prev / Next arrows overlaid on the main image */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur shadow-md flex items-center justify-center text-foreground hover:bg-background transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur shadow-md flex items-center justify-center text-foreground hover:bg-background transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all ${
                  selectedImage === index
                    ? 'ring-2 ring-primary'
                    : 'ring-1 ring-border hover:ring-primary/50'
                }`}
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${productName} — miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">
            {productName} — galería de imágenes
          </DialogTitle>
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 z-50 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={handlePrevious}
                className="absolute left-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
            )}

            {/* Zoomed Image - fills entire dialog */}
            <div className="relative w-full h-full max-w-full max-h-full">
              <Image
                src={images[selectedImage] || '/placeholder.svg'}
                alt={`${productName} — ampliada`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-6 py-3 rounded-full text-base font-medium">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
