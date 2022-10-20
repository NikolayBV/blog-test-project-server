export interface IPost{
    userId?: number,
    id: number,
    title: string,
    body: string,
    userName?: string,
    author?: string,
}

export interface IUser{
    "id": 1,
    "name": string,
    "username"?: string,
    "email"?: string,
    "address"?: {
        "street"?: string,
        "suite"?: string,
        "city"?: string,
        "zipcode"?: string,
        "geo"?: {
            "lat"?: string,
            "lng"?: string
        }
    },
    "phone"?: string,
    "website"?: string,
    "company"?: {
        "name"?: string,
        "catchPhrase"?: string,
        "bs"?: string
    }
}