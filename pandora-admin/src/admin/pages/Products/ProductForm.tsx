import React, { useMemo } from "react";
import { Button, Card, Checkbox, Divider, Form, Input, InputNumber, Space, Switch, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { Category, Product } from "../../../types";
import { getDb, updateDb } from "../../mocks/db";
import { v4 as uuid } from "uuid";

export type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  categories?: string[];
  seoTitle?: string;
  seoDescription?: string;
  hasTax?: boolean;
  hasOptions?: boolean;
  option1?: string;
  weight?: number;
  isDigital?: boolean;
};

function uploaderToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function ProductForm({ mode, product }: { mode: "create" | "edit"; product?: (Product & any) | null }) {
  const navigate = useNavigate();
  const db = getDb();
  const categories = db.categories;
  const [form] = Form.useForm<ProductFormValues>();

  const initial = useMemo<ProductFormValues>(() => {
    if (!product) {
      return {
        name: "",
        description: "",
        price: 0,
        discountPrice: undefined,
        categories: [],
        seoTitle: "",
        seoDescription: "",
        hasTax: false,
        hasOptions: true,
        option1: "Màu sắc",
        weight: undefined,
        isDigital: false,
      };
    }

    const catIds = Array.isArray((product as any).categories)
      ? ((product as any).categories as any[]).map((c) => (typeof c === "string" ? c : c._id))
      : product.category
      ? [typeof product.category === "string" ? product.category : product.category._id]
      : [];

    return {
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      categories: catIds,
      seoTitle: "",
      seoDescription: "",
      hasTax: false,
      hasOptions: true,
      option1: "Màu sắc",
      isDigital: false,
    };
  }, [product]);

  const onSave = async (values?: ProductFormValues) => {
    const v = values ?? (await form.validateFields());

    // handle upload to data-url (no backend)
    const uploadList = (form.getFieldValue(["__images"]) ?? []) as any[];
    const files = uploadList
      .map((x) => x?.originFileObj as File | undefined)
      .filter(Boolean) as File[];
    const imageUrl = files.length > 0 ? await uploaderToDataUrl(files[0]) : (product as any)?.imageUrl;

    const mappedCats: (string | Category)[] = (v.categories ?? []).map((id) => {
      const found = categories.find((c) => c._id === id);
      return found ?? id;
    });

    if (mode === "create") {
      const newProduct: any = {
        _id: uuid(),
          name: v.name,
          description: v.description,
          price: v.price,
        stock: 12,
        color: v.option1,
        rating: 4.8,
        ratingCount: 24,
        category: mappedCats[0],
        categories: mappedCats,
        imageUrl,
      };

      updateDb((db) => ({ ...db, products: [newProduct, ...db.products] }));
      message.success("Đã tạo sản phẩm");
      navigate("/products");
      return;
    }

    if (!product) return;

    updateDb((db) => {
      const next = db.products.map((p) => {
        if (p._id !== product._id) return p;
        return {
          ...p,
          name: v.name,
          description: v.description,
          price: v.price,
          category: mappedCats[0],
          categories: mappedCats,
          imageUrl,
        };
      });
      return { ...db, products: next };
    });

    message.success("Đã cập nhật sản phẩm");
    navigate("/products");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a onClick={() => navigate(-1)} style={{ color: "#6b7280" }}>
              ← back
            </a>
          </div>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            {mode === "create" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
          </h1>
        </div>

        <Space>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" initialValues={initial} onFinish={onSave}>
        <div className="grid" style={{ gridTemplateColumns: "1.4fr 0.6fr" }}>
          <div className="card card-pad">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Thông tin</h3>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Nhập tên sản phẩm" }]}>
              <Input placeholder="Tên sản phẩm" />
            </Form.Item>
            <Form.Item label="Mô tả sản phẩm" name="description">
              <Input.TextArea rows={4} placeholder="Mô tả" />
            </Form.Item>

            <Divider />

            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Images</h3>
            <Form.Item name="__images">
              <Upload.Dragger
                multiple={false}
                accept="image/*"
                beforeUpload={() => false}
                style={{ background: "#fff", borderRadius: 12 }}
              >
                <p style={{ margin: 0, fontWeight: 600, color: "#2563eb" }}>Add File</p>
                <p style={{ margin: 0, color: "#6b7280" }}>Or drag and drop files</p>
              </Upload.Dragger>
            </Form.Item>

            <Divider />

            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Giá</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item label="Giá gốc" name="price" rules={[{ required: true, message: "Nhập giá" }]}>
                <InputNumber style={{ width: "100%" }} placeholder="Enter price" min={0} />
              </Form.Item>
              <Form.Item label="Giá khi được khuyến mãi" name="discountPrice">
                <InputNumber style={{ width: "100%" }} placeholder="Price at Discount" min={0} />
              </Form.Item>
            </div>

            <Form.Item label="" name="hasTax" valuePropName="checked">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Switch />
                <span>Thêm thuế cho sản phẩm này</span>
              </div>
            </Form.Item>

            <Divider />

            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Different Options</h3>
            <Form.Item name="hasOptions" valuePropName="checked">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Switch defaultChecked />
                <span>Sản phẩm này có nhiều tuỳ chọn</span>
              </div>
            </Form.Item>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Tuỳ chọn 1</div>
              <Form.Item label="Màu sắc" name="option1">
                <Input placeholder="Màu sắc" />
              </Form.Item>
              <a style={{ color: "#2563eb" }}>Add More</a>
            </div>

            <Divider />

            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Vận chuyển</h3>
            <Form.Item label="Trọng lượng" name="weight">
              <Input placeholder="Nhập trọng lượng" />
            </Form.Item>

            <Form.Item name="isDigital" valuePropName="checked">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Switch />
                <span>Đây là sản phẩm số</span>
              </div>
            </Form.Item>

          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card className="card" bodyStyle={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Danh mục</div>
            <Form.Item name="categories" style={{ marginBottom: 0 }}>
              <Checkbox.Group style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.map((c) => (
                  <Checkbox key={c._id} value={c._id}>
                    {c.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
            <Divider style={{ margin: "12px 0" }} />
            <a style={{ color: "#2563eb" }} onClick={() => navigate("/categories")}>Thêm danh mục mới</a>
          </Card>

          <Card className="card" bodyStyle={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>SEO Settings</div>
            <Form.Item label="Tiêu đề" name="seoTitle">
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="seoDescription">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Card>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
