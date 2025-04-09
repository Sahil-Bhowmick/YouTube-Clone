import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import YouTubeImg from "../assets/youtube.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    channelName: "",
    about: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
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
        setSignUpData((prevState) => ({
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
      !signUpData.username ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.confirmPassword ||
      !signUpData.channelName
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (signUpData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const cleanFormData = {
      userName: signUpData.username,
      email: signUpData.email,
      password: signUpData.password,
      profilePic: signUpData.profileImage,
      channelName: signUpData.channelName,
      about: signUpData.about,
    };

    try {
      const res = await axios.post(
        "https://youtube-clone-backend-a0an.onrender.com/auth/signUp",
        cleanFormData
      );
      console.log(res);
      toast.success("Signup successful!");
      setSignUpData({
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

    if ((!loginData.username && !loginData.email) || !loginData.password) {
      toast.error("Please provide either username or email and your password.");
      return;
    }

    const cleanFormData = {
      userName: loginData.username,
      email: loginData.email,
      password: loginData.password,
    };

    try {
      const res = await axios.post(
        "https://youtube-clone-backend-a0an.onrender.com/auth/login",
        cleanFormData,
        { withCredentials: true }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userProfilePic", res.data.user.profilePic);
      toast.success("Login successful!");

      setLoginData({
        username: "",
        email: "",
        password: "",
      });

      // Navigate after 2 seconds
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
          {isLogin ? "Sign Up" : "Sign In"}
        </h2>

        {isLogin ? (
          // 📝 Sign Up Form
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            {/* Username */}
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
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                  className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-[#aaa]">
                Email
              </label>
              <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
                <User className="text-[#bbb] ml-2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
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
                  value={signUpData.password}
                  onChange={handleSignUpChange}
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

            {/* Confirm Password */}
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
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
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

            {/* Channel Name */}
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
                  value={signUpData.channelName}
                  onChange={handleSignUpChange}
                  className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                  placeholder="Enter your channel name"
                />
              </div>
            </div>

            {/* About */}
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
                  value={signUpData.about}
                  onChange={handleSignUpChange}
                  className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                  placeholder="Write something about your channel"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-3">
              <label className="block text-sm text-[#aaa] mb-1">
                Select Profile Image
              </label>
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-[#FF0000]">
                {signUpData.profileImage ? (
                  <>
                    <img
                      src={signUpData.profileImage}
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
              {signUpData.profileImage && (
                <button
                  onClick={() =>
                    setSignUpData((prev) => ({ ...prev, profileImage: null }))
                  }
                  className="mt-1 text-base text-[#FF0000] hover:text-[#cc0000] transition cursor-pointer"
                >
                  Remove Image
                </button>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF0000] text-white rounded-md hover:bg-[#cc0000] transition-all text-sm font-medium"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          // 🔐 Sign In Form
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label htmlFor="userName" className="block text-sm text-[#aaa]">
                Username or Email
              </label>
              <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
                <User className="text-[#bbb] ml-2" />
                <input
                  type="text"
                  id="loginIdentifier"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
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
                  value={loginData.password}
                  onChange={handleLoginChange}
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

            <div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF0000] text-white rounded-md hover:bg-[#cc0000] transition-all text-sm font-medium"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        <div className="mt-3 text-center">
          <span className="text-xs text-[#888]">
            {isLogin ? "Already have an account? " : "Don't have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FF0000] cursor-pointer font-medium text-base animate-pulse transition duration-500 ease-in-out hover:brightness-125 hover:drop-shadow-md"
          >
            {isLogin ? "Sign In" : "Sign Up"}
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
