import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertNgoRequest } from "@shared/routes";

export function useNgoRequests() {
  return useQuery({
    queryKey: [api.ngoRequests.list.path],
    queryFn: async () => {
      const res = await fetch(api.ngoRequests.list.path);
      if (!res.ok) throw new Error("Failed to fetch NGO requests");
      return api.ngoRequests.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNgoRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertNgoRequest) => {
      const res = await fetch(api.ngoRequests.create.path, {
        method: api.ngoRequests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.ngoRequests.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit request");
      }
      return api.ngoRequests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ngoRequests.list.path] });
    },
  });
}
