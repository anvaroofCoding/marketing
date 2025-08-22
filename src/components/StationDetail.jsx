import { useParams } from "react-router-dom";
import { useGetStationQuery } from "../services/api";
import { Spin } from "antd";

export default function StationDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetStationQuery(id);

  if (isLoading)
    return (
      <div className="w-full h-[100%] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (error) return <p>Xatolik yuz berdi!</p>;

  console.log(data);

  return <div></div>;
}
