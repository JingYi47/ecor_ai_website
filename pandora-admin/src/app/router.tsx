import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { RequireAdmin } from "../auth/RequireAdmin";
import { AdminLayout } from "../admin/layout/AdminLayout";

import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard/index";
import Orders from "../admin/pages/Orders/index";

import ProductList from "../admin/pages/Products/ProductList";
import ProductCreate from "../admin/pages/Products/ProductCreate";
import ProductEdit from "../admin/pages/Products/ProductEdit";

import Categories from "../admin/pages/Categories/index";
import CategoryCreate from "../admin/pages/Categories/CategoryCreate";
import CategoryEdit from "../admin/pages/Categories/CategoryEdit";

import Placeholder from "../admin/pages/Placeholder";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      { path: "orders", element: <Orders /> },

      { path: "products", element: <ProductList /> },
      { path: "products/new", element: <ProductCreate /> },
      { path: "products/:id/edit", element: <ProductEdit /> },

      { path: "categories", element: <Categories /> },
      { path: "categories/new", element: <CategoryCreate /> },
      { path: "categories/:id/edit", element: <CategoryEdit /> },

      { path: "users", element: <Placeholder title="Khách hàng" /> },
      { path: "reports", element: <Placeholder title="Báo cáo" /> },
      { path: "coupons", element: <Placeholder title="Khuyến mãi" /> },
      { path: "inbox", element: <Placeholder title="Inbox" /> },
      { path: "support", element: <Placeholder title="Hỗ trợ" /> },
      { path: "settings", element: <Placeholder title="Cài đặt cá nhân" /> },
    ],
  },
]);
