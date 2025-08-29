import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useGetArchiveExcelQuery,
  useGetPositionsByStationQuery,
  useGetStationQuery,
  usePostPdfMutation,
  useUpdatePositionMutation,
} from "../services/api";
import {
  Button,
  Input,
  Modal,
  Spin,
  Space,
  Table,
  Tooltip,
  Popconfirm,
  Upload,
  notification,
} from "antd";
import { useState } from "react";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Column, ColumnGroup } = Table;

export default function StationDetail() {
  notification.config({
    placement: "top",
    duration: 3,
  });

  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [inputValue, setInputValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // API hooks
  const {
    data: station,
    isLoading: stationLoading,
    error: Iserr,
  } = useGetStationQuery(id);
  const {
    data: positions,
    isLoading: positionsLoading,
    error: Eserr,
    refetch,
  } = useGetPositionsByStationQuery({
    stationId: id,
    page: currentPage,
    limit: pageSize,
    search: value,
  });

  const [createPosition, { isLoading: createLoding, error: createError }] =
    useCreatePositionMutation();
  const [deletePosition, { isLoading: deleteLoading }] =
    useDeletePositionMutation();
  const [updatePosition, { isLoading: updateLoading }] =
    useUpdatePositionMutation();
  const [postPdf] = usePostPdfMutation();
  const { data: excelBlob, isFetching } = useGetArchiveExcelQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (positionsLoading || stationLoading || createLoding || updateLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (Iserr || Eserr) notification.error({ message: "Sahifani yangilang" });
  if (createError)
    notification.error({
      message: "Bunday positsiya mavjud, boshqa raqam qo‘ying",
    });

  const handleDelete = async (ids) => {
    try {
      await deletePosition(ids).unwrap();
      if (positions?.results?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      notification.success({ message: "Muvaffaqiyatli o'chirildi" });
    } catch (error) {
      notification.error({ message: `${error}` });
    }
  };

  const handleOk = async () => {
    try {
      await createPosition({ station_id: id, number: inputValue }).unwrap();
      notification.success({ message: "Positsiya qo‘shildi" });
      setIsModalOpen(false);
    } catch (err) {
      notification.error({ message: "Xatolik", description: err.toString() });
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePosition({ id: editingId, number: inputValue }).unwrap();
      notification.success({ message: "Muvaffaqiyatli tahrirlandi" });
      setIsEditModalOpen(false);
    } catch (error) {
      notification.error({ message: `${error}` });
    }
  };

  const handleChange = async (info) => {
    const file = info.file;
    if (!file) return;

    try {
      await postPdf({ id, file }).unwrap();
      notification.success({
        message: "PDF muvaffaqiyatli yangilandi!",
        description: "Sahifani yangilang",
      });
      refetch();
    } catch (err) {
      notification.error({ message: "PDF yangilashda xatolik yuz berdi!" });
      console.log(err);
    }
  };

  function handleDownloads() {
    if (!excelBlob) return;
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reklamalar.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    notification.success({ message: "Excel muvaffaqiyatli ko'chirildi" });
  }

  return (
    <div className="w-full h-full p-2 flex flex-col gap-3">
      {/* Header qismi */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        {/* Chap tomondagi tugmalar */}
        <div className="flex flex-wrap gap-2">
          <Link to={station?.schema_image} target="_blank">
            <Button type="primary" icon={<EyeOutlined />}>
              Bekat chizmasi
            </Button>
          </Link>
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
          >
            <Button variant="solid" color="orange" icon={<UploadOutlined />}>
              PDF yangilash
            </Button>
          </Upload>
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

        {/* O'ng tomondagi qidiruv va qo‘shish */}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            variant="solid"
            color="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<PlusOutlined />}
          >
            Joy qo'shish
          </Button>
        </div>
      </div>

      {/* Jadval */}
      <div className="flex-1 overflow-auto">
        <Table
          dataSource={positions?.results}
          rowKey="id"
          scroll={{ x: "max-content" }} // 📌 Jadvalni scrollable qildim
          pagination={{
            current: currentPage,
            pageSize,
            total: positions?.count || 0,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        >
          <ColumnGroup>
            {/* <Column title="ID" dataIndex="id" key="id" /> */}
            <Column title="Raqami" dataIndex="number" key="number" />
            <Column title="Bekat" dataIndex="station" key="station" />
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
              title="Tastiqlovchi"
              dataIndex="created_by"
              key="created_by"
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status) => (
                <Button
                  type="primary"
                  style={{
                    backgroundColor: status ? "red" : "green",
                    borderColor: status ? "red" : "green",
                  }}
                >
                  {status ? "Band" : "Bo'sh"}
                </Button>
              )}
            />
            <Column
              title="Amallar"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <Tooltip title="Reklama qo'shish" color="green">
                    <Button
                      type="primary"
                      style={{ background: "green", borderColor: "green" }}
                      onClick={() => navigate(`position/${record.id}`)}
                    >
                      <AppstoreAddOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Tahrirlash" color="orange">
                    <Button
                      type="primary"
                      style={{ background: "orange", borderColor: "orange" }}
                      onClick={() => {
                        setInputValue(record.number);
                        setEditingId(record.id);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="O‘chirish" color="red">
                    <Popconfirm
                      title="O‘chirishni tasdiqlaysizmi?"
                      okText="Ha"
                      okType="danger"
                      cancelText="Yo‘q"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button danger type="primary" loading={deleteLoading}>
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                </Space>
              )}
            />
          </ColumnGroup>
        </Table>
      </div>

      {/* Qo‘shish Modal */}
      <Modal
        title="Yangi Position qo‘shish"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createLoding}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Bekor qilish
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={createLoding}
            onClick={handleOk}
          >
            Qo‘shish
          </Button>,
        ]}
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Position raqamini kiriting"
          type="number"
        />
      </Modal>

      {/* Tahrirlash Modal */}
      <Modal
        title="Pozitsiyani tahrirlash"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
        confirmLoading={updateLoading}
      >
        <Input
          placeholder="Number kiriting"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Modal>
    </div>
  );
}
