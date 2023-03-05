import axios from "axios";

type ResponseApiListEntry = {
    API: string,
    Description: string
    Auth: string
    HTTPS: boolean,
    Cors: string
    Link: string
    Category: string
}

type ResponseApiList = {
    count: number,
    entries: ResponseApiListEntry[]
};

export class ApiService {
    public static async getApiList(index: number, amount: number, isAuthorized: boolean) {

        // Here ideally we have some caching built in OR we can actually access the api with auth=""
        // Its both memory and network heavy to request the big amount of data every time
        const response  = await axios.get('https://api.publicapis.org/entries?auth=');
        const data: ResponseApiList = response.data

        const accessibleEntries = isAuthorized ? data.entries : data.entries.filter(entry => entry.Auth === "")
        const amountOfAccessibleEntries = accessibleEntries.length
        const minIndex = Math.min(amountOfAccessibleEntries, index)
        const limitedEntries = accessibleEntries.slice(minIndex, Math.min(amountOfAccessibleEntries, index + amount))
        
        return {
            count: limitedEntries.length,
            num_elements: amount,
            start_element: index,
            items: limitedEntries
        };
    }
}