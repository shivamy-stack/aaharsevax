import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertDonation } from "@shared/routes";

export function useDonations() {
  return useQuery({
    queryKey: [api.donations.list.path],
    queryFn: async () => {
      const res = await fetch(api.donations.list.path);
      if (!res.ok) throw new Error("Failed to fetch donations");
      return api.donations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDonation) => {
      // Ensure boolean is true for validation
      const payload = { ...data, isFresh: true };
      
      const res = await fetch(api.donations.create.path, {
        method: api.donations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.donations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create donation");
      }
      return api.donations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.donations.list.path] });
    },
  });
}
