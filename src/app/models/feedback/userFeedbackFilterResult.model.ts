import { IUserFeedback } from "./userFeedback.model";
import { IUserFeedbackJobDetails } from "./userFeedbackJobDetails.model";

export interface IUserFeedbackFilterResult {
    feedbacks: IUserFeedback[];
    jobs: IUserFeedbackJobDetails[];
    categories: string[];
    companies: string[];
    contractTypes: string[];
}