import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const VideoUpload = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  // Video Upload
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: { "video/*": [] },
      multiple: false,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          setVideoFile(file);
          setVideoPreview(URL.createObjectURL(file));
        }
      },
    });

  // Thumbnail Upload
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
      }
    },
  });

  const handleUpload = () => {
    if (!videoFile || !thumbnailFile) {
      alert("Please select both a video and a thumbnail.");
      return;
    }
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            alert("Upload complete!");
            resetForm();
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const resetForm = () => {
    setUploading(false);
    setProgress(0);
    setVideoFile(null);
    setVideoPreview(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setTitle("");
    setDescription("");
    if (onClose) onClose();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-90 p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#0F0F0F] text-white p-6 rounded-lg shadow-xl relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          onClick={resetForm}
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Upload Video</h2>

        {/* Video Upload */}
        {!videoPreview && (
          <div
            {...getVideoRootProps()}
            className="mt-3 border border-gray-600 rounded-lg p-6 text-center cursor-pointer bg-[#222] hover:bg-[#333] transition"
          >
            <input {...getVideoInputProps()} />
            <AiOutlineCloudUpload
              size={40}
              className="text-red-500 mx-auto mb-2"
            />
            <p className="text-sm text-gray-400">
              Drag & drop a video file here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              MP4, AVI, MKV (Max: 2GB)
            </p>
          </div>
        )}

        {/* Video Preview */}
        {videoPreview && (
          <div className="mt-3 relative bg-[#222] p-2 rounded-lg shadow-md">
            <video
              src={videoPreview}
              controls
              className="w-full h-auto max-h-[300px] rounded-lg object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition"
              onClick={() => {
                setVideoFile(null);
                setVideoPreview(null);
              }}
            >
              <IoMdClose size={18} />
            </button>
          </div>
        )}

        {/* Thumbnail Upload */}
        <h3 className="text-lg font-semibold mt-5 text-center">
          Upload Thumbnail
        </h3>
        {!thumbnailPreview && (
          <div
            {...getThumbnailRootProps()}
            className="mt-3 border border-gray-600 rounded-lg p-6 text-center cursor-pointer bg-[#222] hover:bg-[#333] transition"
          >
            <input {...getThumbnailInputProps()} />
            <AiOutlineCloudUpload
              size={40}
              className="text-red-500 mx-auto mb-2"
            />
            <p className="text-sm text-gray-400">Drag & drop an image here</p>
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max: 5MB)</p>
          </div>
        )}

        {/* Thumbnail Preview */}
        {thumbnailPreview && (
          <div className="mt-3 relative bg-[#222] p-2 rounded-lg shadow-md">
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="w-full h-auto max-h-[250px] rounded-lg object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition"
              onClick={() => {
                setThumbnailFile(null);
                setThumbnailPreview(null);
              }}
            >
              <IoMdClose size={18} />
            </button>
          </div>
        )}

        {/* Title, Category & Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400">
            Title
          </label>
          <input
            type="text"
            className="w-full border bg-[#222] p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400">
            Category
          </label>
          <input
            type="text"
            className="w-full border bg-[#222] p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter video category"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-400">
            Description
          </label>
          <textarea
            className="w-full border bg-[#222] p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
          ></textarea>
        </div>

        {/* Upload Button */}
        {/* <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-5 w-full py-2 text-white font-medium rounded-lg transition ${
            uploading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button> */}
        <div className="mt-5 flex gap-4">
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`flex-1 py-2 cursor-pointer text-white font-medium rounded-lg transition ${
              uploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>

          {/* Go Home Button */}
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-2 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Go Home
          </button>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-4 w-full bg-gray-700 h-2 rounded">
            <div
              className="h-2 bg-red-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
