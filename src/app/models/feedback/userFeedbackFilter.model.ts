import { Guid } from "guid-typescript";
import { ApplicationStatus } from "../../enums/applicationStatus.enum";

export interface IUserFeedbackFilter {
    categories: string[];
    companies: string[];
    contractTypes: string[];
    jobId: Guid;
    startDate: Date;
    endDate: Date;
    minRating: number;
    maxRating: number;
    applicationStatuses: ApplicationStatus[];
}