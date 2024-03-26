import { IFilteredUser } from "./filteredUser.model";

export interface IFilteredUsersPagination {
    users: IFilteredUser[];
    numberOfUsers: number;
}