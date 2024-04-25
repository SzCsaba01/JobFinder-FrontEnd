import { Guid } from "guid-typescript";
import { ILocation } from "../location/location.model";

export interface IJob {
    id: Guid;
    title: string;
    description: string;
    companyName: string;
    companyLogo: string;
    url: string;
    contractTypeName: string;
    datePosted: Date;
    dateClosed: Date;
    isActive: boolean;
    isRemote: boolean;
    categories: string[];
    tags: string[];
    locations: ILocation[];
}