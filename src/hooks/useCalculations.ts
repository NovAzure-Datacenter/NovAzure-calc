import { useState, useCallback } from 'react';
import { 
  calculationAPI, 
  type CapexCalculationRequest,
  type OpexCalculationRequest,
  type FullCalculationRequest,
  type CapexCalculationResponse,
  type OpexCalculationResponse,
  type FullCalculationResponse,
  type ComparisonResponse
} from '@/lib/api/calculations';

interface CalculationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useCalculations() {
  const [capexState, setCapexState] = useState<CalculationState<CapexCalculationResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const [opexState, setOpexState] = useState<CalculationState<OpexCalculationResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const [fullState, setFullState] = useState<CalculationState<FullCalculationResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const [comparisonState, setComparisonState] = useState<CalculationState<ComparisonResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const calculateCapex = useCallback(async (request: CapexCalculationRequest) => {
    setCapexState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await calculationAPI.calculateCapex(request);
      setCapexState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate CAPEX';
      setCapexState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const calculateOpex = useCallback(async (request: OpexCalculationRequest) => {
    setOpexState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await calculationAPI.calculateOpex(request);
      setOpexState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate OPEX';
      setOpexState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const calculateFull = useCallback(async (request: FullCalculationRequest) => {
    setFullState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await calculationAPI.calculateFull(request);
      setFullState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate TCO';
      setFullState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const compareSolutions = useCallback(async (request: CapexCalculationRequest) => {
    setComparisonState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await calculationAPI.compare(request);
      setComparisonState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to compare solutions';
      setComparisonState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const clearErrors = useCallback(() => {
    setCapexState(prev => ({ ...prev, error: null }));
    setOpexState(prev => ({ ...prev, error: null }));
    setFullState(prev => ({ ...prev, error: null }));
    setComparisonState(prev => ({ ...prev, error: null }));
  }, []);

  const resetAll = useCallback(() => {
    setCapexState({ data: null, loading: false, error: null });
    setOpexState({ data: null, loading: false, error: null });
    setFullState({ data: null, loading: false, error: null });
    setComparisonState({ data: null, loading: false, error: null });
  }, []);

  return {
    // State
    capex: capexState,
    opex: opexState,
    full: fullState,
    comparison: comparisonState,
    
    // Actions
    calculateCapex,
    calculateOpex,
    calculateFull,
    compareSolutions,
    clearErrors,
    resetAll,
    
    // Computed
    isLoading: capexState.loading || opexState.loading || fullState.loading || comparisonState.loading,
    hasError: !!(capexState.error || opexState.error || fullState.error || comparisonState.error),
    errors: {
      capex: capexState.error,
      opex: opexState.error,
      full: fullState.error,
      comparison: comparisonState.error,
    }
  };
} 