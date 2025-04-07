import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import YouTubeImg from "../assets/youtube.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    channelName: "",
    about: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "youtube-clone");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxfsoabsg/image/upload",
        data
      );

      const imageUrl = response.data.secure_url;

      if (imageUrl) {
        setFormData((prevState) => ({
          ...prevState,
          profileImage: imageUrl,
        }));
        console.log("Image uploaded successfully:", imageUrl);
      } else {
        console.error("Upload failed, no URL returned.");
      }
    } catch (err) {
      console.error(
        "Image upload failed:",
        err.response ? err.response.data : err.message
      );
    }
  };

  // SignUp
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.channelName
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const cleanFormData = {
      userName: formData.username,
      email: formData.email,
      password: formData.password,
      profilePic: formData.profileImage,
      channelName: formData.channelName,
      about: formData.about,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/auth/signUp",
        cleanFormData
      );
      console.log(res);
      toast.success("Signup successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
        channelName: "",
        about: "",
      });
      // Navigate after 3 seconds
      setTimeout(() => {
        setIsLogin(true);
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if ((!formData.username && !formData.email) || !formData.password) {
      toast.error("Please provide either username or email and your password.");
      return;
    }

    const cleanFormData = {
      userName: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/auth/login",
        cleanFormData
      );
      console.log(res);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userProfilePic", res.data.user.profilePic);
      toast.success("Login successful!");

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      // Navigate after 3 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="h-screen bg-[#0f0f0f] flex items-center justify-center p-3">
      <div className="w-full max-w-md md:max-w-lg bg-[#181818] p-4 rounded-xl shadow-lg">
        <div className="flex justify-center mb-3">
          <img src={YouTubeImg} alt="YouTube Logo" className="w-10 sm:w-12" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#f1f1f1] mb-3">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        <form
          onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
          className="space-y-3"
        >
          <div>
            <label htmlFor="userName" className="block text-sm text-[#aaa]">
              Username or Email
            </label>
            <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
              <User className="text-[#bbb] ml-2" />
              <input
                type="text"
                id="userName"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                placeholder="Enter your username or email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-[#aaa]">
              Password
            </label>
            <div className="flex items-center border border-[#333] bg-[#202020] rounded-md relative">
              <Lock className="text-[#bbb] ml-2" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 pr-8 rounded-md text-sm"
                placeholder="Enter your password"
              />
              <div
                className="absolute right-2 cursor-pointer text-[#bbb]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-[#aaa]"
                >
                  Confirm Password
                </label>
                <div className="flex items-center border border-[#333] bg-[#202020] rounded-md relative">
                  <Lock className="text-[#bbb] ml-2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 pr-8 rounded-md text-sm"
                    placeholder="Confirm your password"
                  />
                  <div
                    className="absolute right-2 cursor-pointer text-[#bbb]"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </div>
                </div>
              </div>
              {/* Username Section */}
              <div>
                <label htmlFor="username" className="block text-sm text-[#aaa]">
                  Username
                </label>
                <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
                  <User className="text-[#bbb] ml-2" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Channel Name Section */}
              <div>
                <label
                  htmlFor="channelName"
                  className="block text-sm text-[#aaa]"
                >
                  Channel Name
                </label>
                <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
                  <User className="text-[#bbb] ml-2" />
                  <input
                    type="text"
                    id="channelName"
                    name="channelName"
                    value={formData.channelName}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                    placeholder="Enter your channel name"
                  />
                </div>
              </div>

              {/* Channel About */}
              <div>
                <label htmlFor="about" className="block text-sm text-[#aaa]">
                  About Your Channel
                </label>
                <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
                  <User className="text-[#bbb] ml-2" />
                  <input
                    type="text"
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                    placeholder="Write something about your channel"
                  />
                </div>
              </div>

              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-3">
                <label className="block text-sm text-[#aaa] mb-1">
                  Select Profile Image
                </label>
                <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-[#FF0000]">
                  {formData.profileImage ? (
                    <>
                      <img
                        src={formData.profileImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-xs">Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#333] flex items-center justify-center text-[#bbb] text-xs">
                      No Image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {formData.profileImage && (
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, profileImage: null }))
                    }
                    className="mt-1 text-base text-[#FF0000] hover:text-[#cc0000] transition cursor-pointer"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-[#FF0000] text-white rounded-md hover:bg-[#cc0000] transition-all text-sm font-medium"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <span className="text-xs text-[#888]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FF0000] font-medium text-xs"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default AuthPage;
