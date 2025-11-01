export interface User {
    id: string;
    email: string;
    username: string;
    status: string;
    role: string;
    deleted: number;
}

export interface Address {
    id: string;
    address: string;
    default: boolean;
    wardName?: string;
    districtName?: string;
    provinceName?: string;
    type?: string;
    note?: string;
}

export interface Profile {
    id: string;
    createdDate: string;
    updatedDate: string;
    nickName: string;
    fullName: string;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    avatar: string;
    gender: string;
    addresses?: Address[];
    information: string | null;
    userId: string;
    username: string;
}