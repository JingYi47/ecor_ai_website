import React, { useMemo, useState } from "react";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { currencyVND, getDb } from "../../mocks/db";

type Row = ReturnType<typeof getDb>["products"][number];

export default function ProductList() {
  const navigate = useNavigate();
  const db = getDb();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.products
      .filter((p) => {
        if (filter === "in") return p.stock > 0;
        if (filter === "out") return p.stock === 0;
        return true;
      })
      .filter((p) => {
        if (!q) return true;
        return p.name.toLowerCase().includes(q);
      });
  }, [db.products, filter, query]);

  const columns: ColumnsType<Row> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={r.imageUrl} width={30} height={30} style={{ borderRadius: 8, objectFit: "cover" }} />
          <span style={{ fontWeight: 600 }}>{r.name}</span>
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (_, r) => (r.stock > 0 ? `${r.stock} sản phẩm` : <Tag style={{ borderRadius: 8 }}>{r.inStockText ?? "Hết hàng"}</Tag>),
    },
    { title: "Màu sắc", dataIndex: "color", key: "color" },
    { title: "Giá", dataIndex: "price", key: "price", align: "right", render: (v: number) => currencyVND(v) },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "right",
      render: (_, r) => `${(r.rating ?? 0).toFixed(1)} (${r.ratingCount ?? 0} lượt)`,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
        </div>

        <Space>
          <Button type="default" style={{ borderRadius: 10 }}>
            Xuất DL
          </Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 10 }} onClick={() => navigate("/products/new")}>
            Thêm
          </Button>
        </Space>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "Bộ lọc" },
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

          <div style={{ flex: 1 }} />

          <Space>
            <Button icon={<EditOutlined />} onClick={() => navigate(`/products/${data[0]?._id}/edit`)} disabled={!data[0]} />
            <Button icon={<DeleteOutlined />} disabled />
          </Space>
        </div>

        <Table
          rowSelection={{ type: "checkbox" }}
          columns={columns}
          dataSource={data.map((p) => ({ ...p, key: p._id }))}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
        />
        <div style={{ textAlign: "right", color: "#6b7280", marginTop: 8 }}>{data.length} Kết quả</div>
      </div>
    </div>
  );
}
