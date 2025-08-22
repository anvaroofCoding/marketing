import { useParams } from "react-router-dom";
import {
  useDeletePositionMutation,
  useGetPositionsByStationQuery,
  useGetStationQuery,
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
    limit: pageSize, // ✅ backend limit param kutyapti
  });

  const [deletePosition, { isLoading: deleteLoading }] =
    useDeletePositionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (positionsLoading || stationLoading)
    return (
      <div className="w-full h-[100%] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  if (Iserr || Eserr) return <p>Xatolik yuz berdi!</p>;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (ids) => {
    try {
      await deletePosition(ids).unwrap();
      openNotification("success", "O‘chirildi ✅");
    } catch (error) {
      openNotification("error", `${error}`);
    }
  };

  console.log(positions);

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
          Reklama qo'shish
        </Button>
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>

      <div className="h-[85%] w-full">
        <Table
          dataSource={positions?.results}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: positions?.count || 0, // ✅ backend count qaytaradi
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
                    backgroundColor: status ? "green" : "red",
                    borderColor: status ? "green" : "red",
                  }}
                >
                  {status ? "Bo'sh" : "Band"}
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
                    >
                      <AppstoreAddOutlined />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Tahrirlash">
                    <Button
                      type="primary"
                      style={{ background: "orange", borderColor: "orange" }}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>

                  <Tooltip title="O‘chirish">
                    <Button
                      danger
                      type="primary"
                      onClick={() => handleDelete(record.id)}
                      loading={deleteLoading}
                    >
                      <DeleteOutlined />
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
