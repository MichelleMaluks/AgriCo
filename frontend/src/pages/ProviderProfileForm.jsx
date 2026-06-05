
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProviderProfileForm({ user }) {
  const { providerId } = useParams();
  const navigate = useNavigate();

  
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    description: "",
    profile_images: [], 
  });

  
  const [listings, setListings] = useState([
    {
      name: "",
      description: "",
      priceType: "exact",
      price: "",
      minPrice: "",
      maxPrice: "",
      images: [], 
    },
  ]);


  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProfile({ ...profile, profile_images: files });
  };

 
  const handleListingChange = (index, e) => {
    const newListings = [...listings];
    newListings[index][e.target.name] = e.target.value;
    setListings(newListings);
  };


  const handleImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    const newListings = [...listings];
    newListings[index].images = files;
    setListings(newListings);
  };


  const addListing = () => {
    setListings([
      ...listings,
      {
        name: "",
        description: "",
        priceType: "exact",
        price: "",
        minPrice: "",
        maxPrice: "",
        images: [],
      },
    ]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      const providerFormData = new FormData();
      providerFormData.append("name", profile.name);
      providerFormData.append("location", profile.location);
      providerFormData.append("description", profile.description);

 
      if (profile.profile_images.length > 0) {
        profile.profile_images.forEach((file, i) => {
          providerFormData.append(`profile_images[${i}]`, file);
        });
      }

      let providerRes;
      if (user?.provider_id) {
  
        providerRes = await axios.post(
          `http://127.0.0.1:8000/api/provider/${user.id}?_method=PUT`,
          providerFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {

        providerRes = await axios.post(
          "http://127.0.0.1:8000/api/providers",
          providerFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      for (const listing of listings) {
        const formData = new FormData();
        formData.append("provider_id", providerRes.data.id); 
        formData.append("title", listing.name);
        formData.append("description", listing.description);
        formData.append("price_type", listing.priceType);

        if (listing.priceType === "exact") {
          formData.append("price", listing.price);
        }
        if (listing.priceType === "range") {
          formData.append("min_price", listing.minPrice);
          formData.append("max_price", listing.maxPrice);
        }


        listing.images.forEach((file, i) => {
          formData.append(`images[${i}]`, file);
        });

        await axios.post("http://127.0.0.1:8000/api/services", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert("Profile and listings saved successfully!");
      navigate(`/provider/${providerRes.data.id}`);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="page-container">
      <h2>Complete Your Provider Profile</h2>
      <form onSubmit={handleSubmit} className="provider-form">

        <input
          type="text"
          name="name"
          placeholder="Business Name"
          value={profile.name}
          onChange={handleProfileChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={profile.location}
          onChange={handleProfileChange}
          required
        />
        <textarea
          name="description"
          placeholder="Business Description"
          value={profile.description}
          onChange={handleProfileChange}
          required
        />


        <label>Upload Profile Images</label>
        <input
          type="file"
          multiple
          onChange={handleProfileImageUpload}
        />


        <h3>Listings</h3>
        {listings.map((listing, index) => (
          <div key={index} className="listing-form">
            <input
              type="text"
              name="name"
              placeholder="Service/Product Name"
              value={listing.name}
              onChange={(e) => handleListingChange(index, e)}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={listing.description}
              onChange={(e) => handleListingChange(index, e)}
              required
            />
            <select
              name="priceType"
              value={listing.priceType}
              onChange={(e) => handleListingChange(index, e)}
            >
              <option value="exact">Exact Price</option>
              <option value="range">Price Range</option>
              <option value="contact">Contact for Price</option>
            </select>

            {listing.priceType === "exact" && (
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={listing.price}
                onChange={(e) => handleListingChange(index, e)}
              />
            )}
            {listing.priceType === "range" && (
              <>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={listing.minPrice}
                  onChange={(e) => handleListingChange(index, e)}
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={listing.maxPrice}
                  onChange={(e) => handleListingChange(index, e)}
                />
              </>
            )}


            <label>Upload Service Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleImageUpload(index, e)}
            />
          </div>
        ))}

        <button type="button" onClick={addListing}>
          + Add Another Listing
        </button>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
