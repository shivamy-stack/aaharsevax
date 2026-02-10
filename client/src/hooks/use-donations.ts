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
      const payload = { ...data, isFresh: true };

      const res = await fetch(api.donations.create.path, {
        method: api.donations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      // try to parse JSON body, fall back to plain text
      let parsed: unknown = text;
      try {
        parsed = text ? JSON.parse(text) : text;
      } catch {
        // keep as text
      }

      if (!res.ok) {
        if (res.status === 400) {
          try {
            const validation = api.donations.create.responses[400].parse(parsed);
            throw new Error((validation as any).message || "Validation error");
          } catch {
            throw new Error(typeof parsed === "string" ? parsed : JSON.stringify(parsed));
          }
        }
        throw new Error(typeof parsed === "string" ? parsed : JSON.stringify(parsed));
      }

      try {
        return api.donations.create.responses[201].parse(parsed);
      } catch (e) {
        throw new Error("Invalid response format from server");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.donations.list.path] });
    },
  });
}
