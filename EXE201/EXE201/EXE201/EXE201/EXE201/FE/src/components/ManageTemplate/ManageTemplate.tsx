import React, { useEffect, useState } from "react";
import api from "../../api/apiService";
import {
  Button,
  Form,
  Modal,
  Table,
  Space,
  Popconfirm,
  message,
  FormInstance,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

interface Columns {
  title: string;
  dataIndex: string;
  key: string;
}

interface ManageTemplateProps {
  title: string;
  columns: Columns[];
  formItems?:
    | React.ReactElement
    | ((editingId: string | null) => React.ReactElement);
  apiEndpoint: string;
  mode?: "full" | "view-only" | "create-only" | "delete-only";
  form?: FormInstance;
  onSubmit?: (values: any) => void | Promise<void>; // ✅ Cho phép xử lý submit từ bên ngoài
}

function ManageTemplate({
  columns,
  title,
  formItems,
  apiEndpoint,
  mode = "full",
  form,
  onSubmit,
}: ManageTemplateProps) {
  const { token } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [internalForm] = Form.useForm();
  const formInstance = form || internalForm;
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token) {
      message.error("Authentication required. Please log in.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(apiEndpoint, {
        headers: { "x-auth-token": token },
      });
      const responseData = Array.isArray(res.data)
        ? res.data
        : res.data.data
        ? res.data.data
        : [];
      setData(responseData);
    } catch (error: any) {
      console.error("Fetch error:", error.response?.data || error);
      message.error(error.response?.data?.message || `Error fetching ${title}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint, token]);

  const defaultHandleCreate = async (values: any) => {
    if (!token || mode === "view-only") return;

    try {
      await api.post(apiEndpoint, values, {
        headers: { "x-auth-token": token, "Content-Type": "application/json" },
      });
      toast.success(`${title} tạo thành công`);
      formInstance.resetFields();
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error);
      message.error(error.response?.data?.message || `Error creating ${title}`);
    }
  };

  const defaultHandleEdit = async (values: any) => {
    if (!token || mode !== "full") return;
    try {
      await api.put(`${apiEndpoint}/${editingId}`, values, {
        headers: { "x-auth-token": token },
      });
      toast.success(`${title} câp nhật thành công`);
      formInstance.resetFields();
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || `Error updating ${title}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || (mode !== "full" && mode !== "delete-only")) return;
    try {
      await api.delete(`${apiEndpoint}/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success(`${title} xóa thành công`);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || `Error deleting ${title}`);
    }
  };

  const startEdit = (record: any) => {
    if (mode !== "full") return;
    setEditingId(record._id);
    formInstance.setFieldsValue(record);
    setShowModal(true);
  };

  const columnsWithActions =
    mode === "full"
      ? [
          ...columns,
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => startEdit(record)}
                />
                <Popconfirm
                  title={`Bạn có muốn xóa ${title}?`}
                  onConfirm={() => handleDelete(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : mode === "delete-only"
      ? [
          ...columns,
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
              <Popconfirm
                title={`Bạn có muốn xóa ${title}?`}
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ),
          },
        ]
      : columns;

  const handleFormSubmit = async (values: any) => {
    if (onSubmit) {
      await onSubmit(values);
      setShowModal(false);
      fetchData();
    } else if (editingId) {
      await defaultHandleEdit(values);
    } else {
      await defaultHandleCreate(values);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <ToastContainer />

      {(mode === "full" || mode === "create-only") && (
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            formInstance.resetFields();
            setShowModal(true);
          }}
          style={{ marginBottom: "16px" }}
        >
          Tạo mới {title}
        </Button>
      )}

      <Table
        columns={columnsWithActions}
        dataSource={data}
        loading={loading}
        rowKey="_id"
      />

      {mode !== "view-only" && formItems && (
        <Modal
          title={editingId ? `Thay đổi ${title}` : `Tạo mới ${title}`}
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setEditingId(null);
            formInstance.resetFields();
          }}
          onOk={() => formInstance.submit()}
        >
          <Form
            form={formInstance}
            labelCol={{ span: 24 }}
            onFinish={handleFormSubmit}
          >
            {typeof formItems === "function" ? formItems(editingId) : formItems}
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default ManageTemplate;
