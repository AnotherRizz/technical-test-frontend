"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  InputNumber,
  Space,
  Typography,
  Pagination,
  message,
  Spin,
} from "antd";
import axios from "axios";
import type { Product } from "@/lib/types";

const { Title } = Typography;
const { Search } = Input;

export default function ProductsPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/products", {
        params: { page, limit: 10, search },
      });

      const result = response.data;
      setData(result.data || result);
      setTotal(result.total || 10);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load products");
      messageApi.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, messageApi]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      if (editingProduct) {
        await axios.put("/api/product", { ...editingProduct, ...values });
        messageApi.success(" Product updated successfully");
      } else {
        await axios.post("/api/product", values);
        messageApi.success(" Product created successfully");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      messageApi.error(" Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Title", dataIndex: "product_title" },
    {
      title: "Price",
      dataIndex: "product_price",
      render: (price: number) => `Rp ${price.toLocaleString("id-ID")}`,
    },
    { title: "Category", dataIndex: "product_category" },
    {
      title: "Description",
      dataIndex: "product_description",
      render: (text: string) => (text ? text.slice(0, 50) : "-"),
    },
    {
      title: "Actions",
      render: (record: Product) => (
        <Space>
          <Button
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Title level={3}>Product Management</Title>

      <Space
        style={{
          marginBottom: 16,
          float: "right",
          position: "relative",
          zIndex: 10,
        }}>
        <Search
          placeholder="Search product..."
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsModalOpen(true);
          }}>
          Create Product
        </Button>
      </Space>

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <Spin spinning={loading}>
        <Table
          rowKey="product_id"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Spin>

      <Pagination
        current={page}
        total={total}
        onChange={(p) => setPage(p)}
        style={{ marginTop: 16 }}
      />

      <Modal
        open={isModalOpen}
        title={editingProduct ? "Edit Product" : "Create Product"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={editingProduct ? "Update" : "Create"}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="product_title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="product_price"
            label="Price"
            rules={[{ required: true, message: "Price is required" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="product_description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="product_category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="product_image" label="Image URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
