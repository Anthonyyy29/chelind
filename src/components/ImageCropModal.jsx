import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Maximize2 } from 'lucide-react';

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
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Natural image dimensions
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 300, height: 300 });

  // Dynamic Crop Box Size State
  const [boxSize, setBoxSize] = useState({ width: 260, height: 260 / aspectRatio });
  const [isResizingBox, setIsResizingBox] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 260, height: 260 / aspectRatio });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Reset state on new image or aspect ratio
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    const defaultW = 260;
    setBoxSize({ width: defaultW, height: defaultW / aspectRatio });

    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [imageSrc, aspectRatio]);

  if (!isOpen || !imageSrc) return null;

  // Calculate base rendered dimensions inside crop box
  const imgAspect = imgNaturalSize.width / (imgNaturalSize.height || 1);
  const boxAspect = boxSize.width / (boxSize.height || 1);

  let renderedWidth = boxSize.width;
  let renderedHeight = boxSize.height;

  if (imgAspect > boxAspect) {
    renderedHeight = boxSize.height;
    renderedWidth = boxSize.height * imgAspect;
  } else {
    renderedWidth = boxSize.width;
    renderedHeight = boxSize.width / imgAspect;
  }

  // Dragging Image Handler
  const handleImageMouseDown = (e) => {
    if (isResizingBox) return;
    setIsDraggingImage(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    // Handling Box Resizing
    if (isResizingBox && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      if (resizeHandle.includes('e')) newWidth = Math.max(120, Math.min(320, resizeStart.width + deltaX * 2));
      if (resizeHandle.includes('w')) newWidth = Math.max(120, Math.min(320, resizeStart.width - deltaX * 2));
      if (resizeHandle.includes('s')) newHeight = Math.max(120, Math.min(320, resizeStart.height + deltaY * 2));
      if (resizeHandle.includes('n')) newHeight = Math.max(120, Math.min(320, resizeStart.height - deltaY * 2));

      setBoxSize({ width: newWidth, height: newHeight });
      return;
    }

    // Handling Image Pan/Drag
    if (isDraggingImage) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
    setIsResizingBox(false);
    setResizeHandle(null);
  };

  // Handle Box Resize Start
  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    setIsResizingBox(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: boxSize.width,
      height: boxSize.height,
    });
  };

  const handleSaveCrop = () => {
    const image = imageRef.current;
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Output dimension based on crop box
    const outputWidth = Math.round(boxSize.width * 2.5);
    const outputHeight = Math.round(boxSize.height * 2.5);
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const scaleFactor = outputWidth / boxSize.width;

    ctx.save();
    ctx.clearRect(0, 0, outputWidth, outputHeight);

    // Center of canvas
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Translate by offset scaled
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

    // Draw image centered matching exact preview dimensions
    const drawW = renderedWidth * scaleFactor;
    const drawH = renderedHeight * scaleFactor;

    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-poppins selection:bg-blue-600 selection:text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative text-white shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Preview Area with 100% Accurate Canvas Alignment */}
        <div
          className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 p-4 select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main Draggable Box */}
          <div
            ref={containerRef}
            className="relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-blue-500/90 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center group"
            style={{
              width: `${boxSize.width}px`,
              height: `${boxSize.height}px`,
            }}
            onMouseDown={handleImageMouseDown}
          >
            {/* Image Layer - Sized precisely to contain/fill preview */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              draggable={false}
              className="max-w-none transition-transform duration-75 pointer-events-none"
              style={{
                width: `${renderedWidth}px`,
                height: `${renderedHeight}px`,
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            />

            {/* Rule of Thirds Grid Lines */}
            <div className="absolute inset-0 border border-blue-400/20 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-blue-400/20"></div>
              <div className="border-r border-b border-blue-400/20"></div>
              <div className="border-b border-blue-400/20"></div>
              <div className="border-r border-b border-blue-400/20"></div>
              <div className="border-r border-b border-blue-400/20"></div>
              <div className="border-b border-blue-400/20"></div>
            </div>

            {/* 8 DRAGGABLE RESIZE HANDLES */}
            {/* Top-Left Corner */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
              className="w-4 h-4 rounded bg-blue-500 border-2 border-white shadow-md absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            />
            {/* Top-Right Corner */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
              className="w-4 h-4 rounded bg-blue-500 border-2 border-white shadow-md absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            />
            {/* Bottom-Left Corner */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
              className="w-4 h-4 rounded bg-blue-500 border-2 border-white shadow-md absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            />
            {/* Bottom-Right Corner */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              className="w-4 h-4 rounded bg-blue-500 border-2 border-white shadow-md absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            />

            {/* Top-Center Edge Handle */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'n')}
              className="w-6 h-2 rounded bg-blue-500 border border-white shadow-md absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize z-30 hover:scale-125 transition-transform"
            />
            {/* Bottom-Center Edge Handle */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 's')}
              className="w-6 h-2 rounded bg-blue-500 border border-white shadow-md absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize z-30 hover:scale-125 transition-transform"
            />
            {/* Left-Center Edge Handle */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'w')}
              className="w-2 h-6 rounded bg-blue-500 border border-white shadow-md absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize z-30 hover:scale-125 transition-transform"
            />
            {/* Right-Center Edge Handle */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              className="w-2 h-6 rounded bg-blue-500 border border-white shadow-md absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize z-30 hover:scale-125 transition-transform"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-blue-400" /> Geser gambar atau tarik titik biru di pinggir garis untuk sesuaikan crop
          </p>
        </div>

        {/* Adjustment Controls */}
        <div className="py-3 space-y-3 border-t border-slate-800 mt-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.4"
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
                setBoxSize({ width: 260, height: 260 / aspectRatio });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              Reset Posisi & Ukuran
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
