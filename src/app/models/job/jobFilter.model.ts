export interface IJobFilter {
    title: string;
    isRemote: boolean;
    categories: string[];
    companies: string[];
    country: string;
    state: string;
    city: string;
    contractType: string;
    page: number;
    pageSize: number;
}