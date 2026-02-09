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
      
      console.log('Creating donation with payload:', payload);
      
      const res = await fetch(api.donations.create.path, {
        method: api.donations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('Donation POST response status:', res.status);
      const bodyText = await res.text();
      console.log('Donation POST response body:', bodyText);

      if (!res.ok) {
        if (res.status === 400) {
          try {
            const error = api.donations.create.responses[400].parse(JSON.parse(bodyText));
            throw new Error(error.message);
          } catch (e) {
            throw new Error(bodyText || "Validation error");
          }
        }
        throw new Error(bodyText || "Failed to create donation");
      }
      
      try {
        return api.donations.create.responses[201].parse(JSON.parse(bodyText));
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error("Invalid response format from server");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.donations.list.path] });
    },
  });
}
