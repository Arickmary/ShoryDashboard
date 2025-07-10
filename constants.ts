
import { PartnerStatus } from './types';

export const STATUS_COLORS: Record<PartnerStatus, string> = {
    [PartnerStatus.Active]: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    [PartnerStatus.Onboarding]: 'bg-sky-100 text-sky-800 border-sky-300',
    [PartnerStatus.Inactive]: 'bg-slate-100 text-slate-800 border-slate-300',
};

export const STATUS_DOT_COLORS: Record<PartnerStatus, string> = {
    [PartnerStatus.Active]: "bg-emerald-500",
    [PartnerStatus.Onboarding]: "bg-sky-500",
    [PartnerStatus.Inactive]: "bg-slate-500",
};
