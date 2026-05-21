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

  useEffect(() => {
    let isFetching = false;

    const fetchItems = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const response = await api.get(endpoint);
        setItems(response.data);
      } catch (err) {
        console.log(err.message);

        // FALLBACK 
        if (fallbackData && items.length === 0) {
          setItems(fallbackData);
        }
      } finally {
        isFetching = false;
      }
    };

    fetchItems();

    const interval = setInterval(fetchItems, 5000);

    return () => clearInterval(interval);
  }, [endpoint, fallbackData]); // dependency 

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

  const stats = useMemo(() => {
    const result = { all: items.length };

    for (const [key, value] of Object.entries(filters)) {
      result[key] = items.filter(
        (item) => String(item[filterField] || "") === String(value)
      ).length;
    }

    return result;
  }, [items, filters, filterField]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const preparedData = beforeSubmit
        ? await beforeSubmit(formData, { editingId, items, originalItem })
        : formData;

      if (!preparedData) return;

      if (editingId !== null) {
        const updatedItem = { ...preparedData, id: editingId };
        const response = await api.put(`${endpoint}/${editingId}`, updatedItem);

        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? response.data : item))
        );
      } else {
        const response = await api.post(endpoint, preparedData);
        setItems((prev) => [...prev, response.data]);
      }

      resetForm();
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

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