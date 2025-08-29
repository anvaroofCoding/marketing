import { Card, Descriptions, Spin } from "antd";
import { useGetSearchsIdQuery } from "../services/api";
import { useParams } from "react-router-dom";

export default function AllSearchDetails() {
  const { ida } = useParams();
  const { data, isLoading, isError } = useGetSearchsIdQuery(ida);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <p>Xatolik yuz berdi</p>;
  }

  if (!data) {
    return <p>Ma'lumot topilmadi</p>;
  }

  return (
    <div>
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
    </div>
  );
}
