"use client";

import { Table, Input, Button, Space, Typography } from "antd";

const { Title } = Typography;
const { Search } = Input;

export default function ProductsPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Product Management</Title>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search product..."
          style={{ width: 300 }}
        />
        <Button type="primary">Create Product</Button>
      </Space>

      <Table columns={[]} dataSource={[]} />
    </div>
  );
}
