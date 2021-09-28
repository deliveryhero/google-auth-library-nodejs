import {GetTokenResponse, OAuth2Client} from './oauth2client';
import {Credentials} from './credentials';

export interface AccessToken {
    accessToken: string;
    expiryDate: number;
}

export interface IAccessTokenProvider {
    fetchAccessToken: () => Promise<AccessToken>;
}

export class SingleTokenClient extends OAuth2Client {

    constructor(private readonly accessTokenProvider: IAccessTokenProvider) {
        super();
    }

    public async getAndUpdateCredentials(): Promise<Credentials> {
        const accessToken: AccessToken = await this.accessTokenProvider.fetchAccessToken();
        this.setCredentials({
            access_token: accessToken.accessToken,
            expiry_date: accessToken.expiryDate
        });
        return this.credentials;
    }

    protected async refreshToken(refreshToken?: string | null): Promise<GetTokenResponse> {
        const credentials = await this.getAndUpdateCredentials();
        return {
            tokens: credentials,
            res: null
        }
    }
}
