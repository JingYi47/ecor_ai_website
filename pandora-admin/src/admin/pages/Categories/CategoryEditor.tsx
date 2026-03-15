import React, { useState, useEffect } from "react";
import { Button, Card, Input, List, Space, Switch, message } from "antd";
import { EditOutlined, PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../types";
import { adminCategoryApi, adminProductApi } from "../../../utils/apiClient";

export function CategoryEditor({ mode, category }: { mode: "create" | "edit"; category?: Category | null }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [name, setName] = useState(category?.name ?? "");
  const [productsIn, setProductsIn] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category?.slug) {
      adminProductApi.getAll({ category: category.slug })
        .then((data: any) => setProductsIn(data.products ?? []))
        .catch(() => {});
    }
  }, [category]);

  const onSave = async () => {
    if (!name.trim()) { message.warning("Nhập tên danh mục"); return; }
    setLoading(true);
    try {
      if (mode === "create") {
        await adminCategoryApi.create({ name });
        message.success("Đã tạo danh mục");
      } else if (category) {
        await adminCategoryApi.update(category._id, { name });
        message.success("Đã lưu thay đổi");
      }
      navigate("/categories");
    } catch (err: any) {
      message.error(err.message || "Lỗi lưu danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <a onClick={() => navigate(-1)} style={{ color: "#6b7280" }}>← Back</a>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            {mode === "create" ? "Tạo danh mục" : (name || "Chỉnh sửa danh mục")}
          </h1>
        </div>
        <Space>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="primary" onClick={onSave} loading={loading}>Save</Button>
        </Space>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 0.6fr" }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Tên danh mục</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên danh mục" />
          </div>

          <div style={{ fontWeight: 700, marginBottom: 14 }}>
            Sản phẩm <span style={{ color: "#6b7280", fontWeight: 600 }}>{productsIn.length}</span>
          </div>

          <List
            dataSource={productsIn}
            renderItem={(p: any) => (
              <List.Item actions={[<Button key="edit" type="text" icon={<EditOutlined />} onClick={() => navigate(`/products/${p._id}/edit`)} />]}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <HolderOutlined style={{ color: "#94a3b8" }} />
                  <img
                    src={p.images?.[0]?.url ?? p.imageUrl ?? ""}
                    width={22} height={22}
                    style={{ borderRadius: 6, objectFit: "cover" }}
                  />
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                </div>
              </List.Item>
            )}
          />

          <Button type="link" icon={<PlusOutlined />} style={{ marginTop: 10 }} onClick={() => navigate("/products/new")}>
            Thêm sản phẩm
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
        <Button type="primary" onClick={onSave} loading={loading}>Save</Button>
      </div>
    </div>
  );
}
