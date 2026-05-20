import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  UploadCloud, 
  Film, 
  CheckCircle2, 
  X, 
  Loader2, 
  Info,
  Type,
  AlignLeft
} from "lucide-react";
import { cn } from "../../lib/utils";

// =========================================================================
// PREMIUM CREATOR STUDIO UPLOAD DASHBOARD (CreateFood)
// =========================================================================
// This component replaces the old /create-food view with a modern, high-fidelity
// upload portal inspired by TikTok Creator Studio and YouTube Studio.
// Features:
// - Multipart/form-data pipeline linked directly to Multer/ImageKit backend
// - Immersive drag-and-drop zone with animated bounds
// - Glassmorphic input cards with dynamic focus states
// - Blocking UI elements during active upload cycles
const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // Create preview object URL for the selected video buffer
  useEffect(() => {
    if (!videoFile) {
      setVideoURL("");
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    // Cleanup memory to prevent DOM leaks
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  // Handle standard click-to-select file event
  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFileSelection(file);
  };

  // Handle drag-and-drop drop event
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFileSelection(file);
  };

  const handleFileSelection = (file) => {
    if (!file) {
      setVideoFile(null);
      return;
    }
    // Validate mime type for video files
    if (!file.type.startsWith("video/")) {
      toast.error("Invalid file format. Please upload a valid video (MP4, WebM, MOV).");
      return;
    }
    // Validate file size (approx 100MB limit for Multer stability)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 100MB.");
      return;
    }
    
    setVideoFile(file);
    toast.success("Video attached successfully!");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const clearFile = () => {
    setVideoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Execute payload submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !videoFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("video", videoFile);

      // We pass the formData to Axios, setting multipart/form-data.
      // The backend uses Multer to read the buffer and ImageKit to stream it.
      await axios.post(
        "http://localhost:5000/api/food",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Food Reel uploaded successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to upload reel. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isDisabled = useMemo(
    () => !name.trim() || !videoFile || isUploading,
    [name, videoFile, isUploading]
  );

  return (
    <div className="min-h-full w-full bg-neutral-950 p-4 md:p-8 relative selection:bg-orange-500/30 overflow-y-auto">
      
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/5 blur-[120px] rounded-[100%] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        
        {/* Header Block */}
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center">
            Upload Food Reel
            <span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[10px] uppercase font-black tracking-widest border border-orange-500/20">
              Creator Studio
            </span>
          </h1>
          <p className="text-sm font-medium text-neutral-400">
            Publish viral vertical short videos of your best dishes. Attract local foodies instantly.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-8 pb-20">
          
          {/* SECTION 1: VIDEO UPLOAD ZONE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-200">
                Media File <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] font-medium text-neutral-500">MP4, WebM or MOV</span>
            </div>

            <input
              id="foodVideo"
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={onFileChange}
              disabled={isUploading}
            />

            {!videoFile ? (
              // Empty Dropzone State
              <div
                role="button"
                tabIndex={0}
                onClick={openFileDialog}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full min-h-[280px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group bg-zinc-900/30 backdrop-blur-sm",
                  isDragging 
                    ? "border-orange-500 bg-orange-500/5" 
                    : "border-zinc-800 hover:border-neutral-600 hover:bg-zinc-800/50"
                )}
              >
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragging ? "bg-orange-500/20 text-orange-500 scale-110" : "bg-zinc-800 text-neutral-400 group-hover:text-white group-hover:bg-zinc-700 group-hover:scale-105"
                  )}>
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-neutral-200">
                      Select video to upload
                    </h3>
                    <p className="text-xs font-medium text-neutral-500 max-w-xs mx-auto leading-relaxed">
                      Or drag and drop a file here. Videos should be vertical (9:16) for the best mobile feed experience.
                    </p>
                  </div>
                  <button 
                    type="button"
                    className="mt-4 px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
                  >
                    Select File
                  </button>
                </div>
              </div>
            ) : (
              // File Selected State
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                
                {/* Video Preview Player */}
                <div className="w-full aspect-[9/16] md:aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 relative group">
                  <video
                    className="w-full h-full object-cover"
                    src={videoURL}
                    controls
                    playsInline
                    muted
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 flex items-center space-x-1.5">
                    <Film className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">Preview</span>
                  </div>
                </div>

                {/* File Details & Actions */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-bold">Video Attached</span>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 space-y-1">
                      <p className="text-sm font-medium text-white truncate" title={videoFile.name}>
                        {videoFile.name}
                      </p>
                      <p className="text-xs font-medium text-neutral-500">
                        {(videoFile.size / 1024 / 1024).toFixed(2)} MB • {videoFile.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={openFileDialog}
                      disabled={isUploading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      Replace File
                    </button>
                    <button
                      type="button"
                      onClick={clearFile}
                      disabled={isUploading}
                      className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20 transition-colors disabled:opacity-50"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t border-zinc-800/50" />

          {/* SECTION 2: METADATA FORM */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center">
              Food Details
            </h2>

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="foodName" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                Dish Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Type className="h-4 w-4 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  id="foodName"
                  type="text"
                  placeholder="e.g., Triple Cheese Burst Pizza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUploading}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="foodDesc" className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                <span>Description</span>
                <span className="text-neutral-600 lowercase tracking-normal font-medium text-[10px]">Optional</span>
              </label>
              <div className="relative group">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <AlignLeft className="h-4 w-4 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <textarea
                  id="foodDesc"
                  rows={4}
                  placeholder="Describe the taste, ingredients, spice level, or special offers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Tooltip Box */}
            <div className="flex items-start space-x-3 bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl text-blue-400">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                Your video will be heavily compressed by ImageKit on upload to ensure high-performance streaming across cellular networks. Please do not close the browser tab until the success message appears.
              </p>
            </div>
          </div>

          {/* SUBMIT ACTION */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isDisabled}
              className={cn(
                "flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-sm font-black transition-all duration-300 w-full md:w-auto shadow-xl",
                isDisabled 
                  ? "bg-zinc-800 text-neutral-500 cursor-not-allowed shadow-none" 
                  : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-orange-500/20 active:scale-95"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading to CDN...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  <span>Publish Food Reel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
