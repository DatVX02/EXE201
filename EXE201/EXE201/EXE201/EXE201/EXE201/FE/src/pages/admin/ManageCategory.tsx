import { Form, Input } from "antd";
import ManageTemplate from "../../components/ManageTemplate/ManageTemplate";

function ManageCategory() {
  const title = "category";
  const columns = [
   
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
  ];

  const formItems = (
    <>
      <Form.Item
        name="name"
        label="Tên danh mục"
        rules={[{ required: true, message: "Please input category name" }]}
      >
        <Input placeholder="Enter category name" />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea placeholder="Enter description" />
      </Form.Item>
    </>
  );

  return (
    <div>
      <ManageTemplate
        title={title}
        columns={columns}
        formItems={formItems}
        apiEndpoint='/categories'
      />
    </div>
  );
}

export default ManageCategory;
