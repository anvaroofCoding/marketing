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
  Pagination,
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
  console.log(value);

  const { id } = useParams();
  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 2,
    });
  };
  const {
    data: station,
    isLoading: stationLoading,
    error: Iserr,
  } = useGetStationQuery(id);

  const {
    data: positions,
    isLoading: positionsLoading,
    error: Eserr,
  } = useGetPositionsByStationQuery(id);
  const [deletePosition, { isLoading: deleteLoading }] =
    useDeletePositionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (positionsLoading || stationLoading || deleteLoading)
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
      openNotification("error", error);
    }
  };

  return (
    <div className="w-full h-full">
      {contextHolder}
      <div className="h-[15%] w-full flex justify-between items-center">
        <div>
          <Image width={150} src={station.schema_image} />
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
          closable={{ "aria-label": "Custom Close Button" }}
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
        <Table dataSource={positions.results}>
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
                      onClick={() => {
                        handleDelete(record.id);
                      }}
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
        <Pagination defaultCurrent={1} total={5} />
      </div>
    </div>
  );
}
