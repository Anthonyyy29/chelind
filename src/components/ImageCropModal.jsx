import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move } from 'lucide-react';

export default function ImageCropModal({
  isOpen,
  imageSrc,
  aspectRatio = 1, // 1 for 1:1 logo, 1.77 for 16:9 article, 0.75 for 3:4 player
  title = 'Sesuaikan & Crop Gambar',
  onCropComplete,
  onCancel,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Reset state on new image
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveCrop = () => {
    const image = imageRef.current;
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Output dimension based on aspect ratio
    const outputWidth = 600;
    const outputHeight = 600 / aspectRatio;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.save();
    ctx.clearRect(0, 0, outputWidth, outputHeight);

    // Center of canvas
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Translate by drag offset (normalized to output scale)
    const scaleFactor = outputWidth / (containerRef.current ? containerRef.current.clientWidth : 300);
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

    // Draw image centered
    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;
    ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-poppins selection:bg-blue-600 selection:text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Preview Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[260px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 p-4 select-none">
          <div
            ref={containerRef}
            className="relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-dashed border-blue-500/60 rounded-lg shadow-inner flex items-center justify-center"
            style={{
              width: '280px',
              height: `${280 / aspectRatio}px`,
              maxHeight: '280px',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              draggable={false}
              className="max-w-none transition-transform duration-75 pointer-events-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <Move className="w-3 h-3 text-blue-400" /> Geser gambar untuk menyesuaikan posisi
          </p>
        </div>

        {/* Adjustment Controls */}
        <div className="py-4 space-y-4 border-t border-slate-800 mt-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-mono text-blue-400 min-w-[40px] text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Quick Buttons: Rotate & Reset */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" /> Putar 90°
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              Reset Posisi
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-xs font-bold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" /> Simpan Crop Gambar
          </button>
        </div>
      </div>
    </div>
  );
}
