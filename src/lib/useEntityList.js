import { useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

export function useEntityList(entityName, params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = params.sort || '-updated_date';
      const limit = params.limit || 200;
      const filter = params.filter;
      const result = filter
        ? await base44.entities[entityName].filter(filter, sort, limit)
        : await base44.entities[entityName].list(sort, limit);
      setData(result || []);
    } catch (e) {
      setError(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [entityName, JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}