import { Guid } from 'guid-typescript';
import { ILocation } from '../location/location.model';
import { ICompany } from '../company/company.model';

export interface IJob {
  id: Guid;
  title: string;
  description: string;
  company: ICompany;
  url: string;
  contractTypeName: string;
  datePosted: Date;
  dateClosed: Date;
  isActive: boolean;
  isRemote: boolean;
  categories: string[];
  tags: string[];
  locations: ILocation[];
  isSaved: boolean;
}
