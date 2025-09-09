import {
  Button,
  Card,
  Descriptions,
  Space,
  Spin,
  Tooltip,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
  Empty,
  Typography,
  notification,
  Alert,
  Select,
} from "antd";
import { useParams } from "react-router-dom";
import {
  useCreateAdventMutation,
  useDeleteAdventMutation,
  useGetAdventQuery,
  useUpdateAdventMutation,
} from "../services/api";
import {
  EditOutlined,
  CopyOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";

export default function AdvertisementDetail() {
  const { ids } = useParams();
  notification.config({
    placement: "top", // yuqorida chiqadi
    duration: 3, // nechchi soniyada yopiladi
  });

  const {
    data,
    isLoading: getLoading,
    error: getError,
    refetch,
  } = useGetAdventQuery();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [createAdvent, { isLoading: postLoading }] = useCreateAdventMutation();
  const [updateAdvent, { isLoading: updating }] = useUpdateAdventMutation();

  const [deleteAdvent, { isLoading: deleteLoading }] =
    useDeleteAdventMutation();
  if (getLoading || postLoading || updating || deleteLoading)
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

  const reklama = data.results.find(
    (item) => String(item.position) === String(ids)
  );

  // Modal ochilganda formni prefill qilish
  const handleOpen = () => {
    if (reklama) {
      form.setFieldsValue({
        ...reklama,
        Shartnoma_muddati_boshlanishi: moment(
          reklama.Shartnoma_muddati_boshlanishi
        ),
        Shartnoma_tugashi: moment(reklama.Shartnoma_tugashi),
      });
    }
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("position", ids);
      formData.append("Reklama_nomi", values.Reklama_nomi);
      formData.append("Qurilma_turi", values.Qurilma_turi);
      formData.append("Ijarachi", values.Ijarachi);
      formData.append("Shartnoma_raqami", values.Shartnoma_raqami);
      formData.append(
        "Shartnoma_muddati_boshlanishi",
        values.Shartnoma_muddati_boshlanishi.format("YYYY-MM-DD")
      );
      formData.append(
        "Shartnoma_tugashi",
        values.Shartnoma_tugashi.format("YYYY-MM-DD")
      );
      formData.append("O_lchov_birligi", values.O_lchov_birligi);
      formData.append("Qurilma_narxi", values.Qurilma_narxi);
      formData.append("Egallagan_maydon", values.Egallagan_maydon || "-");
      formData.append("Shartnoma_summasi", values.Shartnoma_summasi);

      if (values.Shartnoma_fayl?.fileList?.[0]?.originFileObj) {
        formData.append(
          "Shartnoma_fayl",
          values.Shartnoma_fayl.fileList[0].originFileObj
        );
      }
      if (values.photo?.fileList?.[0]?.originFileObj) {
        formData.append("photo", values.photo.fileList[0].originFileObj);
      }

      formData.append("contact_number", values.contact_number);

      if (reklama) {
        // Agar reklama mavjud bo'lsa, update qilish
        await updateAdvent({ id: reklama.id, formData }).unwrap();
        notification.success({
          message: "Muvaffaqiyatli yangilandi",
        });
      } else {
        // Yangi reklama qo'shish
        await createAdvent(formData).unwrap();
        notification.success({
          message: "Muvaffaqiyatli qo'shildi",
        });
      }

      await refetch();
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      notification.error({ message: "Xatolik yuz berdi" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvent(id).unwrap(); // unwrap xatolikni catch bilan olish imkonini beradi
      notification.success({
        message: "Reklama o'chirildi",
      });
      // agar kerak bo‘lsa, so‘nggi ma’lumotni qayta yuklash
      refetch();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Xatolik yuz berdi",
        description: err?.data?.message || JSON.stringify(err),
      });
    }
  };

  return (
    <>
      {reklama ? (
        <Card
          title={reklama.Reklama_nomi}
          style={{
            width: "100%",
            margin: "auto",
            overflowY: "auto",
            border: "none",
          }}
          extra={
            <Space style={{ border: "none" }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleOpen}
              >
                Ma'lumotlarni tahrirlash
              </Button>
              <Button
                variant="solid"
                icon={<CopyOutlined />}
                color="red"
                onClick={() => handleDelete(reklama.id)} // id ni kerakli o‘rniga qo‘yish
                loading={deleteLoading}
              >
                Reklamani tugatish
              </Button>
            </Space>
          }
        >
          <div style={{ maxHeight: 650, overflowY: "auto" }}>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ border: "none" }}
            >
              <Descriptions.Item label="ID">{reklama.id}</Descriptions.Item>
              <Descriptions.Item label="Bekat">
                {reklama.station}
              </Descriptions.Item>
              <Descriptions.Item label="Pozitsiya raqami">
                {reklama.position_number}
              </Descriptions.Item>
              <Descriptions.Item label="Qurilma turi">
                {reklama.Qurilma_turi}
              </Descriptions.Item>
              <Descriptions.Item label="Ijarachi">
                {reklama.Ijarachi}
              </Descriptions.Item>
              <Descriptions.Item label="Shartnoma raqami">
                {reklama.Shartnoma_raqami}
              </Descriptions.Item>
              <Descriptions.Item label="Shartnoma boshlanishi">
                {reklama.Shartnoma_muddati_boshlanishi}
              </Descriptions.Item>
              <Descriptions.Item label="Shartnoma tugashi">
                {reklama.Shartnoma_tugashi}
              </Descriptions.Item>
              <Descriptions.Item label="O‘lchov birligi">
                {reklama.O_lchov_birligi}
              </Descriptions.Item>
              <Descriptions.Item label="Qurilma narxi">
                {reklama.Qurilma_narxi} so‘m
              </Descriptions.Item>
              <Descriptions.Item label="Egallagan maydon">
                {reklama.Egallagan_maydon} m²
              </Descriptions.Item>
              <Descriptions.Item label="Shartnoma summasi">
                {reklama.Shartnoma_summasi} so‘m
              </Descriptions.Item>
              <Descriptions.Item label="Tasdiqlovchi">
                {reklama.created_by}
              </Descriptions.Item>
              <Descriptions.Item label="Shartnoma fayl">
                <a
                  href={reklama.Shartnoma_fayl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Yuklab olish
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Rasm">
                <a href={reklama.photo} target="_blank" rel="noreferrer">
                  Yuklab olish
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Telefon">
                {reklama.contact_number}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      ) : (
        <div className="flex justify-center items-center w-full h-full ">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            styles={{ image: { height: 60 } }}
            className="flex justify-center items-center flex-col"
            description={
              <Typography.Text>
                Ma'lumot <a onClick={handleOpen}>topilmadi</a>
              </Typography.Text>
            }
          >
            <Tooltip
              title="Reklama bo'sh bo'lsa qo'shishingiz mumkin"
              color="blue"
            >
              <Button
                type="primary"
                onClick={handleOpen}
                icon={<PlusOutlined />}
              >
                Reklama qo'shish
              </Button>
            </Tooltip>
          </Empty>
        </div>
      )}

      <Modal
        title="Reklama qo‘shish / tahrirlash"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Reklama_nomi"
            label="Reklama nomi"
            rules={[{ required: true }]}
          >
            <Input placeholder="Reklama nomini kiriting" />
          </Form.Item>

          <Form.Item
            name="Qurilma_turi"
            label="Qurilma turi"
            rules={[{ required: true }]}
          >
            <Input placeholder="Masalan: banner, monitor..." />
          </Form.Item>

          <Form.Item
            name="Ijarachi"
            label="Ijarachi"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ijarachi nomi" />
          </Form.Item>

          <Form.Item
            name="Shartnoma_raqami"
            label="Shartnoma raqami"
            rules={[{ required: true }]}
          >
            <Input placeholder="Shartnoma raqami" />
          </Form.Item>

          <Form.Item
            name="Shartnoma_muddati_boshlanishi"
            label="Shartnoma boshlanish sanasi"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="Shartnoma_tugashi"
            label="Shartnoma tugash sanasi"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="O_lchov_birligi"
            label="O‘lchov birligi"
            rules={[
              { required: true, message: "Iltimos, o‘lchov birligini tanlang" },
            ]}
          >
            <Select placeholder="O‘lchov birligini tanlang">
              <Select.Option value="komplekt">komplekt</Select.Option>
              <Select.Option value="kv_metr">kv_metr</Select.Option>
              <Select.Option value="dona">dona</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="Qurilma_narxi"
            label="Qurilma narxi"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={1000} />
          </Form.Item>

          <Form.Item name="Egallagan_maydon" label="Egallagan maydon">
            <Input placeholder="Masalan: 2.5 yoki -" />
          </Form.Item>

          <Form.Item
            name="Shartnoma_summasi"
            label="Shartnoma summasi"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={1000} />
          </Form.Item>

          <Form.Item name="Shartnoma_fayl" label="Shartnoma fayli">
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="photo" label="Rasm">
            <Upload listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="contact_number"
            label="Aloqa raqami"
            rules={[{ required: true }]}
          >
            <Input placeholder="+998..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
