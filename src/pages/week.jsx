import { useState } from "react";
import { Button, Input, notification, Space, Spin, Table, Tooltip } from "antd";
import {
  useGetArchiveQuery,
  useGetArchiveShowExcelQuery,
} from "../services/api";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Week() {
  const { Column, ColumnGroup } = Table;
  const navigate = useNavigate();

  // pagination va search uchun state
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [search, setSearch] = useState("");
  const { data: excelBlob, isFetching } = useGetArchiveShowExcelQuery();

  // API dan malumot olish
  const {
    data,
    isLoading: archiveloading,
    error: archiveerror,
  } = useGetArchiveQuery({ page, limit, search });

  if (archiveloading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  if (archiveerror) {
    notification.error({ message: "Ma'lumotlarni yuklashda xatolik" });
  }

  //   batafsil korish funksiyasi
  function handleShow(ida) {
    navigate(`/archive-show/${ida}/`);
  }

  function handleDownloads() {
    if (!excelBlob) return;

    // Blob'ni browserga yuklab olishga tayyorlash
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reklamalar-arxiv.xlsx"); // Fayl nomi
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Me
    notification.success({ message: "Excel muvaffaqiyatli ko'chirildi" });
  }

  console.log(data);

  return (
    <div className="w-full h-full">
      {/* Search qismi */}
      <div className="h-[15%] w-full flex items-center justify-between gap-2 p-2">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "250px" }}
        />
        <Button
          variant="solid"
          color="green"
          icon={<FileExcelOutlined />}
          onClick={handleDownloads}
          loading={isFetching}
          disabled={!excelBlob}
        >
          Excel ko'chirish
        </Button>
      </div>

      {/* Jadval qismi */}
      <div className="h-[85%] w-full">
        <Table
          dataSource={data?.results}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.count,
            onChange: (p) => setPage(p),
          }}
        >
          <ColumnGroup>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Ijarachi" dataIndex="Ijarachi" key="Ijarachi" />
            <Column
              title="Reklama nomi"
              dataIndex="Reklama_nomi"
              key="Reklama_nomi"
            />
            <Column
              title="Shartnoma raqami"
              dataIndex="Shartnoma_raqami"
              key="Shartnoma_raqami"
            />
            <Column
              title="Bekat nomi"
              dataIndex="station_name"
              key="station_name"
            />
            <Column
              title="Shartnoma boshlanishi"
              dataIndex="Shartnoma_muddati_boshlanishi"
              key="Shartnoma_muddati_boshlanishi"
            />
            <Column
              title="Shartnoma tugashi"
              dataIndex="Shartnoma_tugashi"
              key="Shartnoma_tugashi"
            />
            <Column
              title="Telefon raqami"
              dataIndex="contact_number"
              key="contact_number"
            />
            <Column
              title="Saqlandi"
              dataIndex="created_at"
              key="created_at"
              render={(created_at) => {
                const now = new Date();
                const givenDate = new Date(created_at);
                const diffDays = Math.floor(
                  (now - givenDate) / (1000 * 60 * 60 * 24)
                );

                if (diffDays === 0) return "Bugun";
                if (diffDays === 1) return "Kecha";
                return `${diffDays} kun oldin`;
              }}
            />
            <Column
              title="Batafsil"
              key="id"
              render={(_, record) => (
                <Space size="middle">
                  <Tooltip title="Batafsil ko'rish">
                    <Button
                      type="primary"
                      onClick={() => {
                        handleShow(record.id);
                      }}
                    >
                      <EyeOutlined />
                    </Button>
                  </Tooltip>
                </Space>
              )}
            />
          </ColumnGroup>
        </Table>
      </div>
    </div>
  );
}
