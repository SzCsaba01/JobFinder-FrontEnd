import { ApplicationStatus } from '../../enums/applicationStatus.enum';
import { ICompany } from '../company/company.model';

export interface IUserFeedback {
  company: ICompany;
  companyRating: number;
  feedback: string;
  feedbackDate: Date;
  applicationStatus: ApplicationStatus;
  token: string;
  jobTitle: string;
}
