import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getDb, currencyVND } from "../../mocks/db";

type TxnRow = ReturnType<typeof getDb>["dashboardTxns"][number];
type TopRow = ReturnType<typeof getDb>["dashboardTopProducts"][number];

export default function Dashboard() {
  const db = getDb();

  const txnColumns: ColumnsType<TxnRow> = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Ngày", dataIndex: "date", key: "date" },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => currencyVND(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "Paid" ? "green" : "default"} style={{ borderRadius: 999, padding: "2px 10px" }}>
          {s}
        </Tag>
      ),
    },
  ];

  const topColumns: ColumnsType<TopRow> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={r.imageUrl} width={34} height={34} style={{ borderRadius: 6, objectFit: "cover" }} />
          <span style={{ fontWeight: 600 }}>{r.name}</span>
        </div>
      ),
    },
    { title: "Price", dataIndex: "price", key: "price", render: (v: number) => currencyVND(v) },
    { title: "Số lượng", dataIndex: "qty", key: "qty" },
  ];

  return (
    <div>
      <div className="grid kpi-row" style={{ marginBottom: 18 }}>
        <div className="card kpi-card">
          <div>
            <p className="kpi-title">Tổng DT</p>
            <div className="kpi-value">$10.54</div>
            <div className="kpi-change up">▲ 22.45%</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "#eaf3ff", display: "grid", placeItems: "center" }}>
            $
          </div>
        </div>

        <div className="card kpi-card white">
          <div>
            <p className="kpi-title">Đơn hàng</p>
            <div className="kpi-value">1,056</div>
            <div className="kpi-change up">▲ 15.34%</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "#eaf3ff", display: "grid", placeItems: "center" }}>🛒</div>
        </div>

        <div className="card kpi-card" style={{ background: "#fff7f3" }}>
          <div>
            <p className="kpi-title">Lượt truy cập</p>
            <div className="kpi-value">5.420</div>
            <div className="kpi-change down">▼ 10.24%</div>
          </div>
          <div style={{ width: 66, height: 40, borderRadius: 10, background: "#fff", display: "grid", placeItems: "center" }}>▮▮▮▮▮</div>
        </div>

        <div className="card kpi-card" style={{ background: "#fff7f3" }}>
          <div>
            <p className="kpi-title">Người dùng mới</p>
            <div className="kpi-value">1.650</div>
            <div className="kpi-change up">▲ 15.34%</div>
          </div>
          <div style={{ width: 66, height: 40, borderRadius: 10, background: "#fff", display: "grid", placeItems: "center" }}>▮▮▮▮</div>
        </div>

        <div className="card kpi-card white">
          <div>
            <p className="kpi-title">Người hiện tại</p>
            <div className="kpi-value">9.653</div>
            <div className="kpi-change up">▲ 22.45%</div>
          </div>
          <div style={{ width: 66, height: 40, borderRadius: 10, background: "#fff", display: "grid", placeItems: "center" }}>▮▮▮▮</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card table-card">
          <div className="table-head">
            <h3 className="table-title">Giao dịch gần đây</h3>
          </div>
          <Table
            columns={txnColumns}
            dataSource={db.dashboardTxns.map((t) => ({ ...t, key: t.id }))}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          />
        </div>

        <div className="card table-card">
          <div className="table-head">
            <h3 className="table-title">Sản phẩm bán chạy</h3>
          </div>
          <Table
            columns={topColumns}
            dataSource={db.dashboardTopProducts.map((t) => ({ ...t, key: t.id }))}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          />
        </div>
      </div>
    </div>
  );
}
