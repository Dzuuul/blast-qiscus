import { OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import * as moment from "moment";
import axios from "axios";
import * as fs from "fs"
import * as appRoot from "app-root-path"
import * as stream from "stream";
import { promisify } from "util";
import { InjectQueue } from '@nestjs/bull';
import { IIncomingMessageQueue, IPushTemplateProcessParams, IResultIncomingMessageQueue } from "src/dto/qiscus.dto";
import { AppConfigService } from "@common/config/api/config.service";
import { CommonService } from "@common/services/services.service";
import { IDownloadPhoto } from "src/dto/common.dto";
const finished = promisify(stream.finished);

@Processor('incoming_message')
export class ProcessIncomingMessage {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly commonService: CommonService,
        // @InjectQueue("download_photo") private downloadPhotoQueue: Queue,
        @InjectQueue("reply_message") private replyMessageQueue: Queue
    ) { }

    @Process()
    async processIncomingMessage(job: Job<IIncomingMessageQueue>): Promise<IResultIncomingMessageQueue> {

        try {
            const { waName, message, sender, rcvdTime, photo, messageId, display_phone_number } = job.data;

            const media = "300";
            const currentDate = rcvdTime == "0" ? new Date() : new Date(parseInt(rcvdTime) * 1000);
            const formatRcvdTime = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");

            const body = {
                waName: waName,
                sender: sender,
                message: message,
                rcvdTime: formatRcvdTime,
                media: media,
                photo: photo,
            };

            const sendRequest = await axios.post(this.appConfigService.VALIDATION_SERVICE_URL, body, {
                headers: {
                    "api-user": process.env.API_USER,
                    "api-key": process.env.API_KEY,
                },
            });

            const reply = sendRequest?.data?.data?.reply ? sendRequest.data.data.reply : "";
            const isJson = sendRequest?.data?.data?.isJson;

            return {
                messageId,
                senderFrom: display_phone_number,
                sender,
                media,
                timestamp: formatRcvdTime,
                message,
                reply,
                isJson,
            };
        } catch (error) {
            throw new Error('Incoming Message: ' + error);
        }
    }

    @OnQueueCompleted()
    async onCompleted(job: Job<IResultIncomingMessageQueue>, result: IResultIncomingMessageQueue) {

        await this.replyMessageQueue.add(result, {
            attempts: 10, // If job fails it will retry till 5 times
            backoff: 5000, // static 5 sec delay between retry,
            timeout: 60000
        })
    }
}

// @Processor('download_photo')
// export class ProcessDownloadPhoto {
//     constructor(
//         private readonly appConfigService: AppConfigService
//     ) { }

//     @Process()
//     async downloadPhoto(job: Job<IDownloadPhoto>): Promise<string> {
//         const { sender, filename, mediaId } = job.data
//         const result: any = await this._processDownloadPhoto(mediaId)

//         try {
//             const publicPath = `${appRoot}/../public`
//             if (!fs.existsSync(publicPath)) {
//                 fs.mkdirSync(publicPath);
//             }

//             const senderPath = `${appRoot}/../public/${sender}`
//             if (!fs.existsSync(senderPath)) {
//                 fs.mkdirSync(senderPath);
//             }

//             if (result) {
//                 const path = `${appRoot}/../public/${sender}/${filename}`
//                 const writer = fs.createWriteStream(path)
//                 result.data.pipe(writer)
//                 await finished(writer)
//                 return filename
//             }
//         } catch (error) {
//             throw new Error("Download Photo" + error)
//         }
//     }

//     private async _processDownloadPhoto(mediaId: string) {

//         try {
//             const url = `https://multichannel.qiscus.com/whatsapp/v1/${this.appConfigService.QISCUS_APP_ID}/${this.appConfigService.QISCUS_CHANNEL_ID}/media/${mediaId}`
//             const headers = { 'Qiscus-App-Id': this.appConfigService.QISCUS_APP_ID, 'Qiscus-Secret-Key': this.appConfigService.QISCUS_SECRET_KEY, "Content-Type": "application/json" }

//             const response = await axios({
//                 method: "GET",
//                 url,
//                 headers,
//                 responseType: "stream"
//             })

//             return response
//         } catch (error) {
//             throw new Error("Process Download Photo" + error)
//         }
//     }
// }

@Processor('reply_message')
export class ProcessReplyMessage {
    constructor(
        private readonly commonService: CommonService, private readonly appConfig: AppConfigService
    ) { }

    @Process()
    async processReplyMessage(job: Job<IResultIncomingMessageQueue>) {
        const { sender, senderFrom, reply, messageId, isJson } = job.data;

        return this.commonService.onPushReply({
            template: "",
            text: reply,
            to: sender,
            from: senderFrom,
            messageId: messageId,
            isJson: isJson,
        });
    }

}

@Processor("push_template")
export class ProcessPushTemplate {
    constructor(private readonly appConfigService: AppConfigService) { }

    @Process()
    async processPushMessage(job: Job<IPushTemplateProcessParams>) {
        const { to, templateNameSpace, components, templateName } = job.data;
        const configPush = {
            headers: {
                "Qiscus-App-Id": `${this.appConfigService.QISCUS_APP_ID}`,
                "Qiscus-Secret-Key": `${this.appConfigService.QISCUS_SECRET_KEY}`,
                "content-type": "application/json",
            },
        };

        const requestDataPush = {
            to,
            type: "template",
            template: {
                namespace: templateNameSpace,
                name: templateName,
                language: {
                    policy: "deterministic",
                    code: "id",
                },
                components
            },
        };

        const response = await axios.post(
            `https://multichannel.qiscus.com/whatsapp/v1/${this.appConfigService.QISCUS_APP_ID}/${this.appConfigService.QISCUS_CHANNEL_ID}/messages`,
            requestDataPush,
            configPush,
        )
        if (response?.status < 400) {
            return response.data;
        }
    }
}
@Processor("push_session")
export class ProcessPushSession {
    constructor(
        private readonly commonService: CommonService, private readonly appConfig: AppConfigService
    ) { }

    @Process()
    async processReplyMessage(job: Job<IResultIncomingMessageQueue>) {

        const { sender, senderFrom, reply, messageId, isJson } = job.data;

        return this.commonService.onPushReply({
            template: "",
            text: reply,
            to: sender,
            from: senderFrom,
            messageId: messageId,
            isJson: isJson,
        });
    }

}
