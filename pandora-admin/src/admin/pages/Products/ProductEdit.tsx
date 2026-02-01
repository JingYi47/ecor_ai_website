import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getDb } from "../../mocks/db";
import { ProductForm } from "./ProductForm";

export default function ProductEdit() {
  const { id } = useParams();
  const db = getDb();
  const product = useMemo(() => db.products.find((p) => p._id === id) ?? null, [db.products, id]);
  return <ProductForm mode="edit" product={product} />;
}
