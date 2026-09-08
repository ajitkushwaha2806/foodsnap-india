"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useUser } from "@/store/hooks/useUser";

export function useDownloadedImages({ page = 1, limit = 12 } = {}) {
  const { user, isAuthenticated } = useUser();

  return useQuery({
    queryKey: ["downloaded_images", user?._id || "auth", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(`/api/images/downloads?page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: Boolean(user || isAuthenticated),
    staleTime: 1000 * 60 * 2,
  });
}

export default useDownloadedImages;
