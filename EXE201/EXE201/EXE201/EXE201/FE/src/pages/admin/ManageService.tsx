import { Form, Input, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../api/apiService";
import ManageTemplate from "../../components/ManageTemplate/ManageTemplate";

function ManageService() {
  const title = "Service";
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [productType, setProductType] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching categories:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productType === "purchase") {
      form.setFieldsValue({ duration: undefined });
    }
  }, [productType, form]);

  const handleFormSubmit = async (values: any) => {
    console.log(
      "🚀 Raw Data before processing:",
      JSON.stringify(values, null, 2)
    );

    if (values.productType === "purchase") {
      delete values.duration;
    }

    console.log(
      "🚀 Final Data being sent to API:",
      JSON.stringify(values, null, 2)
    );

    try {
      const response = await api.post("/products", values);
      message.success("Service created successfully!");
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ API Error:", error.message);
        message.error("Error creating service.");
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const e = error as any;
        message.error(e.response?.data?.message || "Error creating service.");
        console.error("❌ API Error:", e.response?.data || e);
      } else {
        console.error("Unknown error:", error);
        message.error("Unknown error occurred.");
      }
    }
  };

  const columns = [
    { title: "Service Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: any) => category?.name || "N/A",
    },
    {
      title: "Type",
      dataIndex: "productType",
      key: "productType",
      render: (type: string) =>
        type === "purchase" ? "Purchase" : "Consultation",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) =>
        image ? (
          <img src={image} alt="Service" width={50} height={50} />
        ) : (
          "No Image"
        ),
    },
  ];

  const formItems = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input service name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please input price" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      {productType !== "purchase" && (
        <Form.Item
          name="duration"
          label="Duration (minutes)"
          rules={[
            {
              required: productType === "consultation",
              message: "Please input duration",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      )}

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select placeholder="Select category">
          {categories.map((cat) => (
            <Select.Option key={cat._id} value={cat._id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="productType"
        label="Product Type"
        rules={[{ required: true, message: "Please select a product type" }]}
      >
        <Select
          placeholder="Select product type"
          onChange={(value) => {
            console.log("🔍 Selected productType:", value);
            setProductType(value);
            form.setFieldsValue({ productType: value });

            if (value === "purchase") {
              form.setFieldsValue({ duration: undefined });
            }
          }}
        >
          <Select.Option value="purchase">Purchase</Select.Option>
          <Select.Option value="consultation">Consultation</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="image" label="Image URL">
        <Input placeholder="Enter image URL" />
      </Form.Item>
    </>
  );

  return (
    <div>
      <ManageTemplate
        title={title}
        columns={columns}
        formItems={formItems}
        apiEndpoint="/products"
        form={form} // ✅ Truyền đúng
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default ManageService;
