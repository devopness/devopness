import { ServersApiService } from '../api/generated/apis/servers-api';

export class ServerService extends ServersApiService {
    /**
     * Converts a string to a valid server's hostname format
     *
     * @param name The given string to converts to hostname
     */
    convertToHostname(name: string) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+/g, '-')
            .replace(/[^a-z0-9-]+|^[-\s]+|[-\s]+$/g, '')
            .replace(/\-{2,}/g, '-');
    }
}
