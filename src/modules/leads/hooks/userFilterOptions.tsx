import { useEffect, useState } from 'react';
import apiService from '../services/api';

export function useFilterOptions() {
  const [options, setOptions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchOptions = async (fieldId: string) => {
    setLoading((prev) => ({ ...prev, [fieldId]: true }));
    try {
      const response = await apiService.fetchOptions(fieldId, '');
      if (response.success) {
        setOptions((prev) => ({ ...prev, [fieldId]: response.data }));
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [fieldId]: false }));
    }
  };

  const fetchOptionsIfNeeded = (fieldId: string) => {
    if (!options[fieldId] || options[fieldId].length === 0) {
      fetchOptions(fieldId);
    }
  };

  return { options, loading, fetchOptionsIfNeeded };
}