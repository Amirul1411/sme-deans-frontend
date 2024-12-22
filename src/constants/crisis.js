export const CRISIS_STATUS = {
  PENDING: 'PD',
  DISPATCHED: 'DP',
  RESOLVED: 'RS'
};

export const CRISIS_STATUS_LABELS = {
  [CRISIS_STATUS.PENDING]: 'Pending',
  [CRISIS_STATUS.DISPATCHED]: 'Dispatched',
  [CRISIS_STATUS.RESOLVED]: 'Resolved'
};

export const CRISIS_STATUS_COLORS = {
  [CRISIS_STATUS.PENDING]: 'crimson',
  [CRISIS_STATUS.DISPATCHED]: 'black',
  [CRISIS_STATUS.RESOLVED]: '#ccc'
};

// Helper functions for crisis management
export const isCrisisActive = (status) => status === CRISIS_STATUS.PENDING || status === CRISIS_STATUS.DISPATCHED;
export const isCrisisResolved = (status) => status === CRISIS_STATUS.RESOLVED;
export const getActiveCount = (crises) => crises?.filter(crisis => isCrisisActive(crisis.crisis_status)).length || 0; 