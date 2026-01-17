import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRepository() {
  return useQuery({
    queryKey: [api.repository.list.path],
    queryFn: async () => {
      const res = await fetch(api.repository.list.path);
      if (!res.ok) throw new Error("Failed to fetch repository data");
      return api.repository.list.responses[200].parse(await res.json());
    },
  });
}
