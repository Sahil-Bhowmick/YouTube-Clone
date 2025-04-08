import React from "react";
import HomePage from "../components/HomePage";

const Home = ({ searchQuery }) => {
  return (
    <div>
      <HomePage searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
