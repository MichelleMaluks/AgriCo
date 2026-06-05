import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import FeaturedProviders from "../components/FeaturedProviders";
import ForumPreview from "../components/ForumPreview";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <SearchBar />
      <Categories />
      <FeaturedProviders />
      <ForumPreview />
    </div>
  );
}
