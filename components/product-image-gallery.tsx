"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in"
          onClick={() => setIsZoomOpen(true)}
        >
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt={`${productName} - Image ${selectedImage + 1}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all ${
                  selectedImage === index ? "ring-2 ring-primary" : "ring-1 ring-border hover:ring-primary/50"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
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
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`${productName} - Zoomed`}
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
  )
}
