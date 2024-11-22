"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GemCollection = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGemstones = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/v1/gemstones');
        setGemstones(response.data.gemstones);
      } catch (error) {
        console.error('Error fetching gemstones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGemstones();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold text-center mb-8">Gemstone Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {gemstones.map(gemstone => (
          <div key={gemstone._id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">{gemstone.name}</h2>
            <p className="text-gray-600 mb-4">{gemstone.origin}</p>
            <div className="mb-4">
              <p><strong>Type:</strong> {gemstone.type}</p>
              <p><strong>Clarity:</strong> {gemstone.clarity}</p>
              <p><strong>Color Grade:</strong> {gemstone.colorGrade}</p>
              <p><strong>Carat Weight:</strong> {gemstone.caratWeight} ct</p>
            </div>
            <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GemCollection;
