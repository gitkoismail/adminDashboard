import { updateItem } from "../services/supabaseCrud";

const useOrderActions = (orders, products, deleteOrderFn) => {
  const handleDeleteWithStock = async (id) => {
    try {
      const order = orders.find((o) => o.id === id);
      if (!order) return;

      const product = products.find(
        (p) => String(p.id) === String(order.productId)
      );

      if (!product) return;

      const stockAffectingStatuses = ["Processing", "Delivered"];

      if (stockAffectingStatuses.includes(order.orderStatus)) {
        await updateItem("/products", product.id, {
          stock: Number(product.stock) + Number(order.quantity),
        });
      }

      await deleteOrderFn(id);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { handleDeleteWithStock };
};

export default useOrderActions;