import React, { useMemo, useState } from "react";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { currencyVND, getDb, type Order } from "../../mocks/db";

function fmtPlaced(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  let hour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${month} ${day}, ${hour}:${min} ${ampm}`;
}

export default function Orders() {
  const db = getDb();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.orders
      .filter((o) => {
        if (filter === "paid") return o.paymentStatus === "Paid";
        if (filter === "pending") return o.paymentStatus === "Pending";
        return true;
      })
      .filter((o) => {
        if (!q) return true;
        return o.code.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      });
  }, [db.orders, filter, query]);

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
    },
    { title: "Ngày đặt", dataIndex: "placedAt", key: "placedAt", render: (v) => fmtPlaced(v) },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (s) => (
        <Tag color={s === "Paid" ? "green" : "default"} style={{ borderRadius: 999, padding: "2px 10px" }}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const map: Record<string, { color: string; text: string }> = {
          Ready: { color: "orange", text: "Ready" },
          Shipped: { color: "geekblue", text: "Shipped" },
          Received: { color: "blue", text: "Received" },
        };
        const v = map[s] ?? { color: "default", text: s };
        return (
          <Tag color={v.color} style={{ borderRadius: 8, padding: "2px 10px" }}>
            {v.text}
          </Tag>
        );
      },
    },
    { title: "Tổng tiền", dataIndex: "total", key: "total", align: "right", render: (v) => currencyVND(v) },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng</h1>
        </div>

        <Space>
          <Button type="default" style={{ borderRadius: 10 }}>
            Xuất DL
          </Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 10 }}>
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
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
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
            <Button icon={<EditOutlined />} />
            <Button icon={<DeleteOutlined />} />
          </Space>
        </div>

        <Table
          rowSelection={{ type: "checkbox" }}
          columns={columns}
          dataSource={data.map((o) => ({ ...o, key: o.id }))}
          pagination={{ pageSize: 12, position: ["bottomCenter"] }}
        />
        <div style={{ textAlign: "right", color: "#6b7280", marginTop: 8 }}>{data.length} Kết quả</div>
      </div>
    </div>
  );
}
