"use client";

import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Typography, Modal, Form, InputNumber, Pagination } from "antd";

const { Title } = Typography;
const { Search } = Input;

export default function ProductsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("Page or search changed");
  }, [page, search]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Product Management</Title>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create Product
        </Button>
      </Space>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <Table rowKey="id" dataSource={data} loading={loading} pagination={false} />

      <Pagination
        current={page}
        total={total}
        onChange={(p) => setPage(p)}
        style={{ marginTop: 16 }}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Create Product"
        onOk={() => console.log("submit")}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
