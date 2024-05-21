/// <reference types="multer" />
declare enum UpdateLivestreamRoomStatus {
    LIVE = "live",
    COMING_SOON = "coming_soon",
    END = "end"
}
export declare class UpdateLivestreamRoomDTO {
    id: string;
    name: string;
    startTime: Date;
    description?: string;
    invitedEmails?: string[];
    listCategory?: string[];
    thumbnail: Express.Multer.File;
    hasSendMail?: string;
    status?: UpdateLivestreamRoomStatus;
}
export {};
