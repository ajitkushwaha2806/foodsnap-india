"use client";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { decryptPayload } from "@/lib/crypto";

const fetchSearch = async ({ queryKey, pageParam = 1 }) => {
  const [, { query, limit }] = queryKey;
  const trimmedQuery = query ? query.trim() : "";

  const params = {
    page: pageParam,
    limit,
  };

  if (trimmedQuery) {
    params.search = trimmedQuery;
  } else {
    params.latest = true;
  }

  const res = await apiClient.get("/api/images/search", {
    params,
  });

  let payload = res.data;
  if (payload?.isEncrypted && payload?.payload) {
    const decrypted = await decryptPayload(payload.payload);
    if (decrypted) {
      payload = decrypted;
    }
  }

  return {
    results: payload.data || payload.results || [],
    pagination: payload.pagination || {
      page: pageParam,
      limit,
      total: 0,
      totalPages: 1,
    },
  };
};

export const useSearchQuery = (query = "", limit = 12, searchTrigger = 0) => {
  return useInfiniteQuery({
    queryKey: ["images_search", { query, limit, searchTrigger }],
    queryFn: fetchSearch,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 3, 
  });
};

export default useSearchQuery;
