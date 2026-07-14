export interface DashboardData {
  currentKm: number;
  totalServices: number;
  totalCost: number;
  warrantyDate: string;
  purchasePrice: number;
  deliveryDate: string;
}

export interface ServiceRecord {
  id: number;
  number: string;
  km: string;
  day: number;
  monthYear: string;
  dow: string;
  works: { text: string; isNew?: boolean; isWarning?: boolean }[];
  costs: { label: string; value: string }[];
  total: string;
}

export interface TyreData {
  replacedAt: string;
  kmsOnCurrent: string;
  remainingEst: string;
  percentUsed: number;
  nextRotation: string;
  spec: string;
  note: string;
}
