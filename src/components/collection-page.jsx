"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const JweleryCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/api/v1/collections"
        );
        setCollections(response.data.collections);
      } catch (err) {
        setError("Failed to load collections.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        padding: "20px",
      }}
    >
      {collections.map((collection) => (
        <div
          key={collection._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            width: "calc(33.33% - 16px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => {
            window.location.href = `/collection/jewelery/${collection._id}`;
          }}
        >
          <img
            src={collection.image}
            alt={collection.name}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px 8px 0 0",
              marginBottom: "12px",
            }}
          />
          <h3 style={{ margin: "8px 0", fontSize: "18px", color: "#333" }}>
            {collection.name}
          </h3>
          <p style={{ fontSize: "14px", color: "#555" }}>
            {collection.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default JweleryCollections;
