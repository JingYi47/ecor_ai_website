import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getDb } from "../../mocks/db";
import { CategoryEditor } from "./CategoryEditor";

export default function CategoryEdit() {
  const { id } = useParams();
  const db = getDb();
  const cat = useMemo(() => db.categories.find((c) => c._id === id) ?? null, [db.categories, id]);
  return <CategoryEditor mode="edit" category={cat} />;
}
