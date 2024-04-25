import { IJob } from "./job.model";

export interface IJobFilterResult {
    jobs: IJob[];
    categories: string[];
    companies: string[];
    contractTypes: string[];
    totalJobs: number;
}