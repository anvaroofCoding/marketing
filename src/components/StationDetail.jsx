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
    placement: "top", // yuqorida chiqadi
    duration: 3, // nechchi soniyada yopiladi
  });
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [inputValue, setInputValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  // const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  // stationni olish
  const {
    data: station,
    isLoading: stationLoading,
    error: Iserr,
  } = useGetStationQuery(id);

  // positions olish
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

  // position qoshish
  const [createPosition, { isLoading: createLoding, error: createError }] =
    useCreatePositionMutation();

  const [deletePosition, { isLoading: deleteLoading }] =
    useDeletePositionMutation();

  const [updatePosition, { isLoading: updateLoading }] =
    useUpdatePositionMutation();

  const [postPdf] = usePostPdfMutation();

  const { data: excelBlob, isFetching } = useGetArchiveExcelQuery();

  

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (positionsLoading || stationLoading || createLoding || updateLoading)
    return (
      <div className="w-full h-[100%] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  if (Iserr || Eserr) {
    notification.error({ message: "Sahifani yangilang" });
  }

  // if (updeteposision) {
  //   notification.error({ message: "Siz mavjud bo'lgan raqamni yozyapsiz!" });
  // }

  if (createError) {
    notification.error({
      message: "Bunday positsiya mavjud iltimos raqamni boshqa qo'ying",
    });
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (ids) => {
    try {
      await deletePosition(ids).unwrap();

      // o'chirilgandan keyin sahifa bo'shab qolmasligi uchun
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
      await createPosition({
        station_id: id, // qaysi stansiya bo‘lsa
        number: inputValue, // formdan kelgan qiymat
      }).unwrap();

      notification.success({ message: "Positsiya qo‘shildi" });
      setIsModalOpen(false);
    } catch (err) {
      notification.error({
        message: "Xatolik",
        description: err.toString(),
      });
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
    const file = info.file; // faqat faylni olamiz

    if (!file) return;

    try {
      await postPdf({ id, file }).unwrap();
      notification.success({
        message: "PDF muvaffaqiyatli yangilandi!",
        description: "Sahifani yangilang",
      });
      refetch();
    } catch (err) {
      console.error("Xato:", err);
      notification.error({ message: "PDF yangilashda xatolik yuz berdi!" });
    }
  };

  function handleDownloads() {
    if (!excelBlob) return;

    // Blob'ni browserga yuklab olishga tayyorlash
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reklamalar.xlsx"); // Fayl nomi
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Me
    notification.success({ message: "Excel muvaffaqiyatli ko'chirildi" });
  }
  // console.log(station);
  return (
    <div className="w-full h-full">
      <div className="h-[15%] w-full flex justify-between items-center">
        <div className="flex gap-5">
          <Link to={station.schema_image} target="_blank">
            <Button type="primary" icon={<EyeOutlined />}>
              Bekat chizmasi
            </Button>
          </Link>
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={() => false} // avtomatik yuklashni bloklaydi
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
        {/* <Input
          placeholder="Qidiruv"
          style={{ width: 400 }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value); // qiymatni olish
          }}
        /> */}
        <div className="flex items-center gap-5">
          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            value={value}
            onChange={(e) => {
              setValue(e.target.value); // qiymatni olish
            }}
            style={{ width: "250px" }}
          />
          <Button
            variant="solid"
            color="primary"
            onClick={showModal}
            icon={<PlusOutlined />}
          >
            Joy qo'shish
          </Button>
        </div>

        {/* qo'shish */}
        <Modal
          title="Yangi Position qo‘shish"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={createLoding}
          footer={[
            <Button key="back" onClick={handleCancel}>
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

        {/* tahrirlash */}
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

      <div className="h-[85%] w-full">
        <Table
          dataSource={positions?.results}
          rowKey="id"
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
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Raqami" dataIndex="number" key="number" />
            <Column title="Bekat" dataIndex="station" key="station" />
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
                  <Tooltip title="Yangi qo‘shish">
                    <Button
                      type="primary"
                      style={{ background: "green", borderColor: "green" }}
                      onClick={() => navigate(`position/${record.id}`)}
                    >
                      <AppstoreAddOutlined />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Tahrirlash">
                    <Button
                      type="primary"
                      onClick={() => {
                        setInputValue(record.number); // mavjud qiymatni inputga tushiramiz
                        setEditingId(record.id); // qaysi id tahrirlanayotganini saqlaymiz
                        setIsEditModalOpen(true); // modalni ochamiz
                      }}
                      style={{ background: "orange", borderColor: "orange" }}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="O‘chirish">
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
    </div>
  );
}
