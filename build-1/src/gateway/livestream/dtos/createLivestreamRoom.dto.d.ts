/// <reference types="multer" />
export declare class CreateLiveStreamRoomDto {
    name?: string;
    startTime?: Date;
    description?: string;
    invitedEmails?: string[];
    hasSendMail: boolean;
    listCategory?: string[];
    thumbnail: Express.Multer.File;
}
