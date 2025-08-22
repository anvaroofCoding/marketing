import { useParams } from "react-router-dom";
import { useGetStationQuery } from "../services/api";
import { Spin } from "antd";

export default function StationDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetStationQuery(id);

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (error) return <p>Xatolik yuz berdi!</p>;

  console.log(data);

  return (
    <div className="w-full h-screen relative">
      <div className="w-[1800px] relative">
        <button className="absolute px-3 py-1 bg-blue-900 text-white rounded-xl bottom-30 left-13">
          15
        </button>
        <img src={data.schema_image} alt="" />
      </div>
    </div>
  );
}
