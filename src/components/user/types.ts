export interface User {
    id: string;
    email: string;
    username: string;
    status: string;
    role: string;
    deleted: number;
}

export interface Profile {
    id: string;
    avatar: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    nickName: string;
    phoneNumber: string;
    userId: string;
}
