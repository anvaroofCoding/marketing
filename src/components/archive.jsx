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

export default function Archive() {
  const { Column, ColumnGroup } = Table;
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const { data: excelBlob, isFetching } = useGetArchiveShowExcelQuery();

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

  function handleShow(ida) {
    navigate(`/archive-show/${ida}/`);
  }

  function handleDownloads() {
    if (!excelBlob) return;
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reklamalar-arxiv.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    notification.success({ message: "Excel muvaffaqiyatli ko'chirildi" });
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search qismi */}
      <div className="h-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-2">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[250px]"
        />
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={handleDownloads}
          loading={isFetching}
          disabled={!excelBlob}
          className="w-full sm:w-auto"
        >
          Excel ko'chirish
        </Button>
      </div>

      {/* Jadval qismi */}
      <div className="flex-1 w-full overflow-x-auto">
        <Table
          dataSource={data?.results}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.count,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: "max-content" }} // kichik ekranlarda horizontal scroll
        >
          <ColumnGroup>
            {/* <Column title="ID" dataIndex="id" key="id" responsive={["sm"]} /> */}
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
              responsive={["md"]}
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
              responsive={["lg"]}
            />
            <Column
              title="Shartnoma tugashi"
              dataIndex="Shartnoma_tugashi"
              key="Shartnoma_tugashi"
              responsive={["lg"]}
            />
            <Column
              title="Telefon raqami"
              dataIndex="contact_number"
              key="contact_number"
              responsive={["md"]}
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
              title="Tasdiqlovchi"
              dataIndex="created_by"
              key="created_by"
              responsive={["md"]}
            />
            <Column
              title="Batafsil"
              key="id"
              render={(_, record) => (
                <Space size="middle">
                  <Tooltip title="Batafsil ko'rish">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleShow(record.id)}
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
