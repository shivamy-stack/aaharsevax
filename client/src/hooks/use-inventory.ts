import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useInventory() {
  return useQuery({
    queryKey: [api.inventory.list.path],
    queryFn: async () => {
      const res = await fetch(api.inventory.list.path);
      if (!res.ok) throw new Error("Failed to fetch inventory data");
      return api.inventory.list.responses[200].parse(await res.json());
    },
  });
}
