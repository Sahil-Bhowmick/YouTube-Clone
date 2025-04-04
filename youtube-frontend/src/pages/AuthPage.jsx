import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import YouTubeImg from "../assets/youtube.png";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    channelName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleProfileImageChange = async (e) => {
  //   const file = e.target.files[0];
  //   const data = new formData();
  //   data.append("file", file[0]);
  //   data.append("upload_preset", "youtube-clone");
  //   try {
  //     // cloudName = "deye1inp8";
  //     const response = await axios.post(
  //       "https://api.cloudinary.com/v1_1/deye1inp8/image/upload",
  //       data
  //     )
  //     const imageUrl = response.data.url;
  //     console.log(response);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   if (file) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       profileImage: URL.createObjectURL(file),
  //     }));
  //   }
  // };

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
        "https://api.cloudinary.com/v1_1/deye1inp8/image/upload",
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password.");
      return;
    }
    console.log("Logging in with:", formData.email, formData.password);
    // Add Firebase/Auth API logic here
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.channelName
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    console.log(
      "Signing up with:",
      formData.email,
      formData.password,
      formData.channelName,
      formData.profileImage
    );
    // Add Firebase/Auth API logic here
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
            <label htmlFor="email" className="block text-sm text-[#aaa]">
              Email or phone
            </label>
            <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
              <Mail className="text-[#bbb] ml-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-[#aaa]">
              Password
            </label>
            <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
              <Lock className="text-[#bbb] ml-2" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                placeholder="Enter your password"
              />
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
                <div className="flex items-center border border-[#333] bg-[#202020] rounded-md">
                  <Lock className="text-[#bbb] ml-2" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#FF0000] pl-2 rounded-md text-sm"
                    placeholder="Confirm your password"
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
    </div>
  );
};

export default AuthPage;
