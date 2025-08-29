import { Card, Descriptions, Spin, Empty, notification, Alert } from "antd";
import { useParams } from "react-router-dom";
import { useGetTimeTugaganQuery } from "../services/api";

export default function Weekdaitail() {
  const { id } = useParams();
  notification.config({
    placement: "top", // yuqorida chiqadi
    duration: 3, // nechchi soniyada yopiladi
  });

  const {
    data,
    isLoading: getLoading,
    error: getError,
  } = useGetTimeTugaganQuery(id);

  if (getLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spin />
      </div>
    );
  if (getError)
    return (
      <div className="w=full h-full flex justify-center-items-center">
        <Empty />
        <Alert message="Warning" type="warning" showIcon closable />
      </div>
    );

  return (
    <>
      <Card
        title={data.Reklama_nomi}
        style={{
          width: "100%",
          margin: "auto",
          overflowY: "auto",
          border: "none",
        }}
      >
        <div style={{ maxHeight: 650, overflowY: "auto" }}>
          <Descriptions
            bordered
            column={1}
            size="small"
            style={{ border: "none" }}
          >
            <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label="Stansiya">
              {data.station}
            </Descriptions.Item>
            <Descriptions.Item label="Pozitsiya raqami">
              {data.position_number}
            </Descriptions.Item>
            <Descriptions.Item label="Qurilma turi">
              {data.Qurilma_turi}
            </Descriptions.Item>
            <Descriptions.Item label="Ijarachi">
              {data.Ijarachi}
            </Descriptions.Item>
            <Descriptions.Item label="Shartnoma raqami">
              {data.Shartnoma_raqami}
            </Descriptions.Item>
            <Descriptions.Item label="Shartnoma boshlanishi">
              {data.Shartnoma_muddati_boshlanishi}
            </Descriptions.Item>
            <Descriptions.Item label="Shartnoma tugashi">
              {data.Shartnoma_tugashi}
            </Descriptions.Item>
            <Descriptions.Item label="O‘lchov birligi">
              {data.O_lchov_birligi}
            </Descriptions.Item>
            <Descriptions.Item label="Qurilma narxi">
              {data.Qurilma_narxi} so‘m
            </Descriptions.Item>
            <Descriptions.Item label="Egallagan maydon">
              {data.Egallagan_maydon} m²
            </Descriptions.Item>
            <Descriptions.Item label="Shartnoma summasi">
              {data.Shartnoma_summasi} so‘m
            </Descriptions.Item>
            <Descriptions.Item label="Shartnoma fayl">
              <a href={data.Shartnoma_fayl} target="_blank" rel="noreferrer">
                Yuklab olish
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Rasm">
              <a href={data.photo} target="_blank" rel="noreferrer">
                Yuklab olish
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Telefon">
              {data.contact_number}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </>
  );
}
