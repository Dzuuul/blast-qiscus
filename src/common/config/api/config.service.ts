import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {
    }

    get ENV(): string {
        return this.configService.get<string>("app.ENV")
    }
    get PORT(): string {
        return this.configService.get<string>("app.PORT")
    }
    get VERSION(): string {
        return this.configService.get<string>("app.VERSION")
    }
    get NAME_PROGRAM(): string {
        return this.configService.get<string>("app.NAME_PROGRAM")
    }
    get PROGRAM_ID(): string {
        return this.configService.get<string>("app.PROGRAM_ID")
    }
    get KEYWORD(): string {
        return this.configService.get<string>("app.KEYWORD")
    }
    get DOMAIN_APP(): string {
        return this.configService.get<string>("app.DOMAIN_APP")
    }
    get API_USER(): string {
        return this.configService.get<string>("app.API_USER")
    }
    get API_KEY(): string {
        return this.configService.get<string>("app.API_KEY")
    }
    // get QISCUS_CHANNEL_ID(): number {
    //     return qiscussChannelId
    // }
    // get QISCUS_APP_ID(): string {
    //     return qiscusAppId
    // }
    // get QISCUS_SECRET_KEY(): string {
    //     return qiscusSecretKey
    // }
    // get WA_GATEWAY_NUMBER(): number {
    //     return waGatewayNumber
    // }
    get PROMO_MEDIA(): { ID: number, CODE: number } {
        return {
            ID: 3,
            CODE: 300
        }
    }
    get VALIDATION_SERVICE_URL(): string {
        return this.configService.get<string>("app.VALIDATION_SERVICE_URL")
    }
    get WHATSAPP_SERVICE_URL(): string {
        return this.configService.get<string>("app.WHATSAPP_SERVICE_URL");
    }

    // ======================== QISCUS ======================== //

    get QISCUS_WA_GATEWAY_NUMBER(): number {
        return this.configService.get<number>("app.QISCUS_WA_GATEWAY_NUMBER");
    }
    get QISCUS_APP_ID(): string {
        return this.configService.get<string>("app.QISCUS_APP_ID");
    }
    get QISCUS_SECRET_KEY(): string {
        return this.configService.get<string>("app.QISCUS_SECRET_KEY");
    }
    get QISCUS_CHANNEL_ID(): number {
        return this.configService.get<number>("app.QISCUS_CHANNEL_ID");
    }
    get QISCUS_TOKEN_UPLOAD(): string {
        return this.configService.get<string>("app.QISCUS_TOKEN_UPLOAD");
    }
    get QISCUS_TEMPLATE_NAMESPACE(): string {
        return this.configService.get<string>("app.QISCUS_TEMPLATE_NAMESPACE");
    }
    get QISCUS_TEMPLATE_NAME_APPROVED_WA(): string {
        return this.configService.get<string>("app.QISCUS_TEMPLATE_NAME_APPROVED_WA");
    }
    get QISCUS_TEMPLATE_NAME_REJECT_WA(): string {
        return this.configService.get<string>("app.QISCUS_TEMPLATE_NAME_REJECT_WA");
    }
    get QISCUS_SEND_MESSAGE_URL(): string {
        return this.configService.get<string>("app.QISCUS_SEND_MESSAGE_URL");
    }
    get QISCUS_UPLOAD_URL(): string {
        return this.configService.get<string>("app.QISCUS_UPLOAD_URL");
    }
}
