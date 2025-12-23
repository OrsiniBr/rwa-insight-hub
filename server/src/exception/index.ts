export default class InsightHubException extends Error { 
    constructor(errorMessage: string) {
        super(errorMessage);
    }
}