import { InsuranceProductStatus } from './types';

export const STATUS_COLORS: Record<InsuranceProductStatus, string> = {
    [InsuranceProductStatus.Active]: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    [InsuranceProductStatus.InReview]: 'bg-sky-100 text-sky-800 border-sky-300',
    [InsuranceProductStatus.Pilot]: 'bg-amber-100 text-amber-800 border-amber-300',
    [InsuranceProductStatus.Discontinued]: 'bg-red-100 text-red-800 border-red-300',
};

export const STATUS_DOT_COLORS: Record<InsuranceProductStatus, string> = {
    [InsuranceProductStatus.Active]: "bg-emerald-500",
    [InsuranceProductStatus.InReview]: "bg-sky-500",
    [InsuranceProductStatus.Pilot]: "bg-amber-500",
    [InsuranceProductStatus.Discontinued]: "bg-red-500",
};