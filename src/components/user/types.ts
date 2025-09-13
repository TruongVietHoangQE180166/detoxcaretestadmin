export interface User {
    id: string;
    email: string;
    username: string;
    status: string;
    role_name: string;
    is_deleted: number;
    created_date: string;
}

export interface Profile {
    id: string;
    avatar: string;
    full_name: string;
    gender: string;
    date_of_birth: string;
    nick_name: string;
    phone_number: string;
    user_id: string;
}
