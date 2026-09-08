import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, clearSearch, triggerSearch } from "../slice/searchSlice";

export const useSearch = () => {
  const dispatch = useDispatch();
  const { query, searchTrigger } = useSelector((state) => state.search || {});

  const updateQuery = useCallback(
    (newQuery) => {
      dispatch(setQuery(newQuery));
      dispatch(triggerSearch());
    },
    [dispatch]
  );

  const resetSearch = useCallback(() => {
    dispatch(clearSearch());
    dispatch(triggerSearch());
  }, [dispatch]);

  return {
    query: query || "",
    searchTrigger: searchTrigger || 0,
    updateQuery,
    resetSearch,
  };
};

export default useSearch;
