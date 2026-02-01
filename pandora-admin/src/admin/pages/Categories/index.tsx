import React from "react";
import { Button } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getDb } from "../../mocks/db";

export default function Categories() {
  const navigate = useNavigate();
  const db = getDb();

  const countProducts = (catId: string) => db.products.filter((p) => {
    const c = p.category as any;
    const id = typeof c === "string" ? c : c?._id;
    return id === catId;
  }).length;

  const imageFor = (name: string) => {
    const map: Record<string, string> = {
      Iphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=60",
      Tivi: "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=900&q=60",
      Ipad: "https://images.unsplash.com/photo-1587033411391-5e4f5d5d8d7d?auto=format&fit=crop&w=900&q=60",
      HeadPhones: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=60",
      MiniSpeaker: "https://images.unsplash.com/photo-1518441902117-f0a2b5d4e1c0?auto=format&fit=crop&w=900&q=60",
    };
    return map[name] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60";
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Danh mục thể loại</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/categories/new")}>Thêm</Button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {db.categories.map((c, idx) => (
          <div
            key={c._id}
            className="card"
            style={{ overflow: "hidden", cursor: "pointer" }}
            onClick={() => navigate(`/categories/${c._id}/edit`)}
          >
            <div style={{ position: "relative", height: 220, background: "#f3f4f6" }}>
              <img src={imageFor(c.name)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: idx === 1 ? "rgba(15,23,42,.35)" : "transparent",
                  display: "grid",
                  placeItems: "center",
                  opacity: idx === 1 ? 1 : 0,
                }}
              >
                <Button icon={<EditOutlined />} style={{ borderRadius: 10 }}>
                  Edit
                </Button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 800 }}>{c.name === "Iphone" ? "Điện Thoại" : c.name}</div>
              <div style={{ color: "#6b7280" }}>{countProducts(c._id)} sản phẩm</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
