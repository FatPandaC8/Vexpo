export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'exhibitor' | 'organizer' | 'admin';
}
export type UserRole = 'exhibitor' | 'organizer' | 'admin';
export interface Company {
    id: string;
    name: string;
    email: string;
    description: string | null;
    industry: string | null;
    website: string | null;
    country: string | null;
    city: string | null;
    exhibitorId: number;
    booths?: Booth[];
}
export type ExpoStatus = 'Live' | 'Upcoming' | 'Past';
export interface Expo {
    id: string;
    name: string;
    type: string | null;
    description: string | null;
    startDate: string;
    endDate: string;
    organizerId: number;
    booths?: Booth[];
}
export type BoothStatus = 'pending' | 'approved' | 'rejected';
export interface Booth {
    id: string;
    name: string;
    description: string | null;
    status: BoothStatus;
    modelPath: string | null;
    mapRow: number | null;
    mapCol: number | null;
    expoId: string;
    companyId: string;
    company?: Pick<Company, 'id' | 'name' | 'industry' | 'email' | 'website' | 'description'>;
    expo?: Pick<Expo, 'id' | 'name'>;
}
export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface PaginatedResponse<T> {
    items: T[];
    meta: PaginationMeta;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole | null;
    temp?: true;
}
export interface JwtUser {
    userId: string;
    email: string;
    role: UserRole | null;
}
export interface GoogleProfile {
    name: {
        givenName: string;
        familyName: string;
    };
    emails: Array<{
        value: string;
    }>;
    photos: Array<{
        value: string;
    }>;
}
export interface GoogleOAuthUser {
    email: string;
    name: string;
    picture: string | undefined;
    accessToken: string;
    refreshToken: string;
}
