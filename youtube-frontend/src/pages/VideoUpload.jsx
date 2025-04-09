import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoUpload = ({ onClose }) => {
  const [videoState, setVideoState] = useState({
    videoFile: null,
    videoPreview: null,
    thumbnailFile: null,
    thumbnailPreview: null,
    title: "",
    description: "",
    category: "",
    uploading: false,
    progress: 0,
    videoLoading: false,
    thumbnailLoading: false,
  });
  const navigate = useNavigate();

  const cloudinaryPreset = "youtube-clone";
  const cloudinaryVideoUrl =
    "https://api.cloudinary.com/v1_1/dxfsoabsg/video/upload";
  const cloudinaryImageUrl =
    "https://api.cloudinary.com/v1_1/dxfsoabsg/image/upload";

  const updateState = (newState) => {
    setVideoState((prev) => ({ ...prev, ...newState }));
  };

  // Flies Uploading to Cloudinary
  const uploadFiles = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", cloudinaryPreset);

    if (type === "video") {
      updateState({ videoLoading: true });
    } else {
      updateState({ thumbnailLoading: true });
    }

    try {
      const response = await axios.post(
        type === "video" ? cloudinaryVideoUrl : cloudinaryImageUrl,
        data
      );

      const url = response.data.secure_url;

      if (type === "video") {
        updateState({
          videoFile: url,
          videoPreview: URL.createObjectURL(file),
        });
      } else {
        updateState({
          thumbnailFile: url,
          thumbnailPreview: URL.createObjectURL(file),
        });
      }
    } catch (err) {
      console.error("Upload failed:", err.message);
      alert("Upload failed. Please try again.");
    } finally {
      if (type === "video") {
        updateState({ videoLoading: false });
      } else {
        updateState({ thumbnailLoading: false });
      }
    }
  };

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: { "video/*": [] },
      multiple: false,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          const fakeEvent = { target: { files: [file] } };
          uploadFiles(fakeEvent, "video");
        }
      },
    });

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const fakeEvent = { target: { files: [file] } };
        uploadFiles(fakeEvent, "image");
      }
    },
  });

  const handleUpload = async () => {
    const { title, description, category, videoFile, thumbnailFile } =
      videoState;

    if (!title || !description || !category || !videoFile || !thumbnailFile) {
      toast.warning(
        "Please fill out all fields and upload both video and thumbnail."
      );
      return;
    }

    const payload = {
      title,
      description,
      videoLink: videoFile,
      videoType: category,
      thumbnail: thumbnailFile,
    };

    console.log("Uploading video with payload:", payload);

    try {
      updateState({ uploading: true });

      // const response = await axios.post(
      //   "https://youtube-clone-backend-a0an.onrender.com/api/video",
      //   payload,
      //   { withCredentials: true }
      // );
      const response = await axios.post(
        "https://youtube-clone-backend-a0an.onrender.com/api/video",
        payload,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateState({ progress: percentCompleted });
          },
        }
      );

      console.log("Upload successful:", response.data);
      toast.success("Video uploaded successfully!");

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error("Upload failed. Please try again.");
    } finally {
      updateState({ uploading: false });
    }
  };

  const resetForm = () => {
    setVideoState({
      videoFile: null,
      videoPreview: null,
      thumbnailFile: null,
      thumbnailPreview: null,
      title: "",
      description: "",
      category: "",
      uploading: false,
      progress: 0,
    });
    if (onClose) onClose();
  };

  useEffect(() => {
    const isLogin = localStorage.getItem("userId");
    if (!isLogin) {
      toast.warning("Please login to upload a video");
      navigate("/auth");
    }
  }, []);

  const {
    videoPreview,
    thumbnailPreview,
    title,
    description,
    category,
    uploading,
    progress,
    videoLoading,
    thumbnailLoading,
  } = videoState;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-90 p-4">
      <div className="w-full max-w-xl bg-[#0F0F0F] text-white p-6 rounded-lg shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          onClick={resetForm}
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Upload Video</h2>

        {videoLoading ? (
          <div className="flex flex-col justify-center items-center mt-3 space-y-2">
            <CircularProgress style={{ color: "red" }} />
            <p className="text-sm text-gray-300">
              Uploading video... Please wait
            </p>
          </div>
        ) : !videoPreview ? (
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
        ) : (
          <div className="mt-3 relative bg-[#222] p-2 rounded-lg shadow-md">
            <video
              src={videoPreview}
              controls
              className="w-full h-auto max-h-[300px] rounded-lg object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition"
              onClick={() =>
                updateState({ videoFile: null, videoPreview: null })
              }
            >
              <IoMdClose size={18} />
            </button>
          </div>
        )}

        <h3 className="text-lg font-semibold mt-5 text-center">
          Upload Thumbnail
        </h3>
        {thumbnailLoading ? (
          <div className="flex flex-col justify-center items-center mt-3 space-y-2">
            <CircularProgress style={{ color: "red" }} />
            <p className="text-sm text-gray-300">
              Uploading thumbnail... Please wait
            </p>
          </div>
        ) : !thumbnailPreview ? (
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
        ) : (
          <div className="mt-3 relative bg-[#222] p-2 rounded-lg shadow-md">
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="w-full h-auto max-h-[250px] rounded-lg object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition"
              onClick={() =>
                updateState({ thumbnailFile: null, thumbnailPreview: null })
              }
            >
              <IoMdClose size={18} />
            </button>
          </div>
        )}

        {/* Title */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400">
            Title
          </label>
          <input
            type="text"
            className="w-full border bg-[#222] p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={title}
            onChange={(e) => updateState({ title: e.target.value })}
            placeholder="Enter video title"
          />
        </div>

        {/* Category */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400">
            Category
          </label>
          <input
            type="text"
            className="w-full border bg-[#222] p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={category}
            onChange={(e) => updateState({ category: e.target.value })}
            placeholder="Enter video category"
          />
        </div>

        {/* Description */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-400">
            Description
          </label>
          <textarea
            className="w-full border bg-[#222] p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={description}
            onChange={(e) => updateState({ description: e.target.value })}
            placeholder="Enter video description"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-4">
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
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-2 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Go Home
          </button>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mt-4">
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                backgroundColor: "#333",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#ef4444", // Tailwind red-500
                },
              }}
            />
            <p className="text-sm text-gray-400 mt-2 text-center">
              Uploading: {progress}%
            </p>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default VideoUpload;
