"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await fetch(
          `https://reklamaproject.onrender.com/api/stations/`
        );
        const stations = await response.json();
        const foundStation = stations.find((s) => s.id === Number.parseInt(id));
        setStation(foundStation);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching station:", error);
        setLoading(false);
      }
    };

    fetchStation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Stantsiya ma'lumotlari yuklanmoqda...</div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Stantsiya topilmadi</div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Xaritaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Xaritaga qaytish
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{station.name}</h1>
          <p className="text-lg mb-2">
            <strong>Liniya:</strong> {station.line_name}
          </p>
          <p className="text-lg mb-4">
            <strong>Chiziq raqami:</strong> {station.chiziq}
          </p>

          {station.schema_image && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Stantsiya sxemasi</h2>
              <img
                src={station.schema_image || "/placeholder.svg"}
                alt={`${station.name} sxemasi`}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
