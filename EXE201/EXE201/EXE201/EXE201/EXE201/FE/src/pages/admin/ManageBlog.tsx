import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import api from "../../api/apiService";
import ManageTemplate from "../../components/ManageTemplate/ManageTemplate";
// import { render } from "react-dom";

function ManageBlog() {
  const title = "bài viết";
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  // Fetch danh sách categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Cấu hình cột hiển thị trong bảng
  const columns = [
    { title: "Tên", dataIndex: "title", key: "title" },
    { title: "Tác giả", dataIndex: "createName", key: "createName" },

    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryName",
      render: (categoryId: string) => {
        const category = categories.find((cat) => cat._id === categoryId);
        return category ? category.name : "N/A";
      },
    },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt='blog' style={{ width: 100 }} />
      ),
    },
  ];

  // Form nhập Blog
  const formItems = (
    <>
      <Form.Item
        name='title'
        label='Tên'
        rules={[{ required: true, message: "Please input blog title" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name='content'
        label='Nội dung'
        rules={[{ required: true, message: "Please input blog content" }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name='createName'
        label='Tác giả'
        rules={[{ required: true, message: "Please input author name" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name='categoryId'
        label='Danh mục'
        rules={[{ required: true, message: "Please select a category" }]}>
        <Select placeholder='Select category'>
          {categories.map((cat) => (
            <Select.Option key={cat._id} value={cat._id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='image' label='Hình ảnh '>
        <Input />
      </Form.Item>
    </>
  );

  return (
    <ManageTemplate
      title={title}
      columns={columns}
      formItems={formItems}
      apiEndpoint='/blogs'
    />
  );
}

export default ManageBlog;
