import React, { useEffect } from "react";
import { Button, Card, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/auth.store";
import { getToken } from "../../utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const t = getToken();
    if (t) {
      // restore a mock admin user
      setAuth(t, { _id: "admin", email: "admin@pandora.local", role: "admin" });
      navigate("/", { replace: true });
    }
  }, [navigate, setAuth]);

  const onFinish = (v: any) => {
    const token = `mock_${Date.now()}`;
    setAuth(token, { _id: "admin", email: v.email ?? "admin@pandora.local", role: "admin" });
    navigate("/", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--page-bg)" }}>
      <Card style={{ width: 380, borderRadius: 14 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>PandoraPro Admin</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>Đăng nhập (mock) – không cần backend</p>

        <Form layout="vertical" onFinish={onFinish} initialValues={{ email: "admin@pandora.local", password: "admin" }}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="admin@pandora.local" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
