"use client";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchSearch = async ({ queryKey, pageParam = 1 }) => {
  const [, { query, limit }] = queryKey;

  const res = await apiClient.get("/api/images/search", {
    params: {
      search: query ? query.trim() : undefined,
      page: pageParam,
      limit,
    },
  });

  const payload = res.data;
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
