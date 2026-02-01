import React, { useMemo, useState } from "react";
import { Button, Card, Input, List, Space, Switch, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../types";
import { getDb, updateDb } from "../../mocks/db";

export function CategoryEditor({ mode, category }: { mode: "create" | "edit"; category?: Category | null }) {
  const navigate = useNavigate();
  const db = getDb();
  const [visible, setVisible] = useState(true);

  const [name, setName] = useState(category?.name ?? "Iphone");
  const title = name;

  const productsIn = useMemo(() => {
    if (!category) return [];
    return db.products.filter((p) => {
      const c = p.category as any;
      const id = typeof c === "string" ? c : c?._id;
      return id === category._id;
    });
  }, [db.products, category]);

  const onSave = () => {
    if (mode === "create") {
      const newCat: Category = { _id: crypto.randomUUID?.() ?? String(Date.now()), name, slug: name.toLowerCase().replace(/\s+/g, "-") };
      updateDb((db) => ({ ...db, categories: [newCat, ...db.categories] }));
      message.success("Đã tạo danh mục");
      navigate("/categories");
      return;
    }

    if (!category) {
      navigate("/categories");
      return;
    }
    updateDb((db) => ({
      ...db,
      categories: db.categories.map((c) => (c._id === category._id ? { ...c, name } : c)),
    }));
    message.success("Đã lưu thay đổi");
    navigate("/categories");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <a onClick={() => navigate(-1)} style={{ color: "#6b7280" }}>
            ← Back
          </a>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            {title}
          </h1>
        </div>
        <Space>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </Space>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 0.6fr" }}>
        <div className="card" style={{ padding: 18 }}>
          {mode === "create" && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Tên danh mục</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên danh mục" />
            </div>
          )}
          <div style={{ fontWeight: 700, marginBottom: 14 }}>
            Products <span style={{ color: "#6b7280", fontWeight: 600 }}>{productsIn.length}</span>
          </div>

          <List
            dataSource={productsIn}
            renderItem={(p) => (
              <List.Item
                actions={[
                  <Button key="edit" type="text" icon={<EditOutlined />} />,
                  <Button key="del" type="text" icon={<DeleteOutlined />} />,
                ]}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <HolderOutlined style={{ color: "#94a3b8" }} />
                  <img src={(p as any).imageUrl} width={22} height={22} style={{ borderRadius: 6, objectFit: "cover" }} />
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                </div>
              </List.Item>
            )}
          />

          <Button type="link" icon={<PlusOutlined />} style={{ marginTop: 10 }}>
            Thêm
          </Button>
        </div>

        <Card className="card" bodyStyle={{ padding: 18 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Category Visibility</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Switch checked={visible} onChange={setVisible} />
            <span>Visible on site</span>
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="primary" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
