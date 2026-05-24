import { supabase } from "./supabaseClient";

const getTableName = (endpoint) => {
  return endpoint.replace("/", "");
};

const createId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return String(Date.now());
};

export const getItems = async (endpoint) => {
  const table = getTableName(endpoint);

  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    throw error;
  }

  return data || [];
};

export const addItem = async (endpoint, item) => {
  const table = getTableName(endpoint);

  const { data, error } = await supabase
    .from(table)
    .insert(item)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateItem = async (endpoint, id, item) => {
  const table = getTableName(endpoint);

  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteItem = async (endpoint, id) => {
  const table = getTableName(endpoint);

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw error;
  }

  return id;
};