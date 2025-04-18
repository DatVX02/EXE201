import { Form, Input, Rate } from "antd";
import ManageTemplate from "../../components/ManageTemplate/ManageTemplate";

function ManageRating() {
  const title = "đánh giá";
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "serviceName", key: "serviceName" },
    { title: "Đánh giá", dataIndex: "serviceRating", key: "serviceRating" ,render: (rating: number) => <Rate disabled defaultValue={rating} />,},
    { title: "Ghi chú", dataIndex: "serviceContent", key: "serviceContent" },
    { title: "Người đánh giá", dataIndex: "createName", key: "createName" },

    
  ];

  const formItems = (
    <>
      <Form.Item
        name='rating'
        label='Rating'
        rules={[{ required: true, message: "Please input category name" }]}>
        <Input />
      </Form.Item>
      <Form.Item name='description' label='Description'>
        <Input.TextArea />
      </Form.Item>
    </>
  );

  return (
    <div>
      <ManageTemplate title={title} columns={columns} formItems={formItems} apiEndpoint="/ratings" mode="delete-only"/>
    </div>
  );
}

export default ManageRating;
