import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, Space, Table, Tag, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { adminProductApi } from "../../../utils/apiClient";
import { currencyVND } from "../../mocks/db";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const load = () => {
    setLoading(true);
    adminProductApi.getAll()
      .then((data) => setProducts(data.products ?? data ?? []))
      .catch(() => message.error("Không tải được sản phẩm"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await adminProductApi.delete(id);
      message.success("Đã xoá sản phẩm");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      message.error(err.message || "Lỗi xoá sản phẩm");
    }
  };

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => {
        if (filter === "in") return (p.stock ?? 0) > 0;
        if (filter === "out") return (p.stock ?? 0) === 0;
        return true;
      })
      .filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [products, filter, query]);

  const columns: ColumnsType<any> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={r.images?.[0]?.url ?? r.imageUrl ?? ""}
            width={36} height={36}
            style={{ borderRadius: 8, objectFit: "cover", background: "#f0f0f0" }}
          />
          <span style={{ fontWeight: 600 }}>{r.name}</span>
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (v) => (v > 0 ? `${v} sản phẩm` : <Tag style={{ borderRadius: 8 }}>Hết hàng</Tag>),
    },
    { title: "Giá", dataIndex: "price", key: "price", align: "right", render: (v: number) => currencyVND(v) },
    {
      title: "Trạng thái",
      dataIndex: "isHidden",
      key: "isHidden",
      render: (v) => (
        <Tag color={v ? "red" : "green"} style={{ borderRadius: 8 }}>
          {v ? "Ẩn" : "Hiện"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/products/${r._id}/edit`)} />
          <Popconfirm title="Xoá sản phẩm này?" onConfirm={() => handleDelete(r._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Sản phẩm</h1></div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 10 }} onClick={() => navigate("/products/new")}>
            Thêm
          </Button>
        </Space>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Select
            value={filter} onChange={setFilter} style={{ width: 180 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "in", label: "Còn hàng" },
              { value: "out", label: "Hết hàng" },
            ]}
          />
          <Input
            prefix={<span style={{ opacity: 0.6 }}>🔍</span>}
            placeholder="Tìm kiếm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 360 }}
          />
        </div>

        <Table
          dataSource={data}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </div>
    </div>
  );
}
