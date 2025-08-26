import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useGetPositionsByStationQuery,
  useGetStationQuery,
  useUpdatePositionMutation,
} from "../services/api";
import {
  Button,
  Image,
  Input,
  Modal,
  Spin,
  Space,
  Table,
  notification,
  Tooltip,
  Popconfirm,
} from "antd";
import { useState } from "react";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Column, ColumnGroup } = Table;

export default function StationDetail() {
  const [api, contextHolder] = notification.useNotification();
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [inputValue, setInputValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 2,
    });
  };

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
  } = useGetPositionsByStationQuery({
    stationId: id,
    page: currentPage,
    limit: pageSize,
    search: value, // ✅ backend limit param kutyapti
  });

  // position qoshish
  const [createPosition, { isLoading: createLoding, error: createError }] =
    useCreatePositionMutation();

  const [deletePosition, { isLoading: deleteLoading }] =
    useDeletePositionMutation();

  const [updatePosition, { isLoading: updateLoading }] =
    useUpdatePositionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (positionsLoading || stationLoading || createLoding || updateLoading)
    return (
      <div className="w-full h-[100%] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  if (Iserr || Eserr) {
    openNotification("error", "Sahifani yangilang");
  }
  if (createError) {
    openNotification(
      "error",
      "Bunday positsiya mavjuda iltimos raqamni boshqa qo'ying"
    );
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

      openNotification("success", "Muvaffaqiyatli o'chirildi");
    } catch (error) {
      openNotification("error", `${error}`);
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
      notification.error({ message: "Xatolik", description: err.toString() });
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePosition({ id: editingId, number: inputValue }).unwrap();
      notification.success({ message: "Muvaffaqiyatli tahrirlandi" });
      setIsEditModalOpen(false);
    } catch (error) {
      notification.error({ message: error });
    }
  };
  return (
    <div className="w-full h-full">
      {contextHolder}
      <div className="h-[15%] w-full flex justify-between items-center">
        <div>
          <Image width={150} src={station?.schema_image} />
        </div>
        <Input
          placeholder="Qidiruv"
          style={{ width: 400 }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value); // qiymatni olish
          }}
        />
        <Button variant="solid" color="primary" onClick={showModal}>
          Joy qo'shish
        </Button>

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
