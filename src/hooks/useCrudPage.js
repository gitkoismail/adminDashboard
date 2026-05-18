import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const useCrudPage = ({
  endpoint,
  initialForm,
  searchFields,
  filterField,
  filters,
  beforeSubmit,
  fallbackData,
}) => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [originalItem, setOriginalItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // 🔥 FETCH + FALLBACK
  useEffect(() => {
    let isFetching = false;

    const fetchItems = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const response = await api.get(endpoint);
        setItems(response.data);
      } catch (err) {
        console.log("API failed → fallback used");
        if (fallbackData) {
          setItems(fallbackData);
        }
      } finally {
        isFetching = false;
      }
    };

    fetchItems();

    const interval = setInterval(fetchItems, 5000);
    return () => clearInterval(interval);
  }, [endpoint, fallbackData]);

  // 🔍 FILTER + SEARCH
  const filteredItems = useMemo(() => {
    let result = items;

    if (filter !== "all") {
      const targetValue = filters[filter];
      result = result.filter(
        (item) => String(item[filterField] || "") === String(targetValue)
      );
    }

    if (search.trim()) {
      const lowered = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || "").toLowerCase().includes(lowered)
        )
      );
    }

    return result;
  }, [items, filter, search, filters, filterField, searchFields]);

  // 📊 STATS
  const stats = useMemo(() => {
    const result = { all: items.length };

    for (const [key, value] of Object.entries(filters)) {
      result[key] = items.filter(
        (item) => String(item[filterField] || "") === String(value)
      ).length;
    }

    return result;
  }, [items, filters, filterField]);

  // ✏️ CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setOriginalItem(null);
  };

  // 🔥 CREATE + UPDATE (FALLBACK DESTEKLİ)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const preparedData = beforeSubmit
        ? await beforeSubmit(formData, { editingId, items, originalItem })
        : formData;

      if (!preparedData) return;

      if (editingId !== null) {
        let updatedItem;

        try {
          const response = await api.put(
            `${endpoint}/${editingId}`,
            preparedData
          );
          updatedItem = response.data;
        } catch {
          // 🔥 fallback update
          updatedItem = { ...preparedData, id: editingId };
        }

        setItems((prev) =>
          prev.map((item) =>
            item.id === editingId ? updatedItem : item
          )
        );
      } else {
        let newItem;

        try {
          const response = await api.post(endpoint, preparedData);
          newItem = response.data;
        } catch {
          // 🔥 fallback create
          newItem = {
            ...preparedData,
            id: Date.now().toString(),
          };
        }

        setItems((prev) => [...prev, newItem]);
      }

      resetForm();
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  // 🔥 DELETE (FALLBACK DESTEKLİ)
  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
    } catch {
      // 🔥 fallback delete (sessiz geç)
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✏️ EDIT START
  const handleEditStart = (id) => {
    const selected = items.find((item) => item.id === id);
    if (!selected) return;

    setFormData(selected);
    setOriginalItem({ ...selected });
    setEditingId(selected.id);
  };

  return {
    items,
    formData,
    editingId,
    filter,
    setFilter,
    search,
    setSearch,
    filteredItems,
    stats,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEditStart,
    setFormData,
  };
};

export default useCrudPage;