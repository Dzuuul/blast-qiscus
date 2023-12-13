import { Injectable } from "@nestjs/common";
import { ProjectDbModel } from "src/datasource/databases/project-db/interfaces/model.interface";
import { ProjectDbService } from "src/datasource/databases/project-db/project-db.service";
import { IPushReply } from "src/dto/qiscus.dto";
import { AppConfigService } from "@common/config/api/config.service";
import axios, { AxiosResponse } from "axios";
import * as moment from "moment";

@Injectable()
export class CommonService {
    private projectDbModels: ProjectDbModel;

    constructor(
        // private readonly logsDbService: LogsDbService,
        private readonly projectDbService: ProjectDbService,
        private readonly appConfigService: AppConfigService
    ) {
        this.projectDbModels = this.projectDbService.getProjectDbModels()
    }

    public changePhone(hp: string, convertTo: string): string {
        const phone = hp.replace(/\D/g, '')

        if (phone.length < 6 || phone.length >= 15) {
            return ("")
        }

        if (convertTo == "62") {
            if (phone.substring(0, 2) == "62") {
                return (phone)
            } else if (phone.substring(0, 2) == "08") {
                return (`62${phone.substring(1)}`)
            }
        }

        if (convertTo == "08") {
            if (phone.substring(0, 2) == "08") {
                return (phone)
            } else if (phone.substring(0, 2) == "62") {
                return (`08${phone.substring(2)}`)
            } else {
                return ("")
            }
        }

        return (phone)
    }

    public async randString(length: number, chars: string, frontText: string): Promise<string> {
        var result = `${frontText}`;
        const rand = (char: string) => {
            let result = ``
            for (var i = char.length + frontText.length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        const afterRand: string = frontText + await rand(chars)
        for (var i = length - (frontText.length); i > 0; --i) result += afterRand[Math.floor(Math.random() * afterRand.length)];
        return result;
    }

    // public async reply(replyId: number, arrVariable: string[], media: number): Promise<{ replyMessage: string, replyId: number }> {
    //     try {
    //         const getReplyMessage = await this.projectDbModels.Reply.Reply.findOne({ id: replyId, mediaId: media })
    //         let data = { replyMessage: "", replyId: 0 }

    //         if (!getReplyMessage) {
    //             return data
    //         }

    //         data.replyMessage = getReplyMessage.reply_message
    //         for (let index = 0; index < arrVariable.length; index++) {
    //             const variable = arrVariable[index]
    //             data.replyMessage = getReplyMessage.reply_message.replace("XXX", variable)
    //         }

    //         return data
    //     } catch (error) {
    //         throw new Error('Error: Reply Format')
    //     }
    // }

    public convertEmoji(text: string) {
        return text.replace(/\p{Extended_Pictographic}/ug, (m: any, idx: any) =>
            `[e-${m.codePointAt(0).toString(16)}]`
        )
    }

    public async onPushReply(param: IPushReply) {
        try {
            const { template, text, to, messageId, from, isJson } = param
            const recipient_id = this.changePhone(to, "62")

            let replyType = 0
            if (template == "") {
                replyType = 1
            } else {
                replyType = 2
            }

            // const insertPushMessage = await this.logsDbmodels.OutgoingMessage.OutgoingMessage.insert({
            //     messageId,
            //     message: text,
            //     from: from,
            //     to: +recipient_id,
            //     template,
            //     type: replyType,
            //     status: 0,
            //     sendDate: ""
            // })

            let reason = ""
            // const pushMessageId = insertPushMessage.raw.insertedId
            let submitDate = moment().format("YYYY-MM-DD HH:mm:ss")
            let status = 0
            const config = {
                headers: { 'Qiscus-App-Id': this.appConfigService.QISCUS_APP_ID, 'Qiscus-Secret-Key': this.appConfigService.QISCUS_SECRET_KEY, "Content-Type": "application/json" }
            };

            let data: any = {
                recipient_type: "individual",
                to: recipient_id,
            };

            let responseData;

            if (isJson === 1) {
                // const replies = Object.values(JSON.parse(text));
                const parsedText = JSON.parse(text);
                const imageValues = Object.entries(parsedText)
                    .filter(([key]) => key.includes("image"))
                    .map(([_, value]) => value);

                const bubbleValues = Object.entries(parsedText)
                    .filter(([key]) => key.includes("bubble"))
                    .map(([_, value]) => value);

                const buttonValues = Object.entries(parsedText)
                    .filter(([key]) => key.includes("button"))
                    .map(([_, value]) => value);

                let lastBubble = 0
                if (bubbleValues.length > 0 && buttonValues.length > 0) {
                    lastBubble = 1
                }

                if (imageValues.length > 0) {
                    for (let x = 0; x < imageValues.length - lastBubble; x++) {

                        const data = {
                            recipient_type: "individual",
                            to: recipient_id,
                            type: "image",
                            image: {
                                link: imageValues[x],
                            },
                        };

                        responseData = await axios.post(`https://multichannel.qiscus.com/whatsapp/v1/${this.appConfigService.QISCUS_APP_ID}/${this.appConfigService.QISCUS_CHANNEL_ID}/messages`, data, config);
                    }
                }

                if (bubbleValues.length > 0) {
                    for (let x = 0; x < bubbleValues.length - lastBubble; x++) {

                        const data = {
                            recipient_type: "individual",
                            to: recipient_id,
                            type: "text",
                            text: {
                                body: bubbleValues[x],
                            },
                        };

                        responseData = await axios.post(`https://multichannel.qiscus.com/whatsapp/v1/${this.appConfigService.QISCUS_APP_ID}/${this.appConfigService.QISCUS_CHANNEL_ID}/messages`, data, config);
                    }
                }

                if (buttonValues.length > 0) {
                    const data = {
                        recipient_type: "individual",
                        to: recipient_id,
                        type: "interactive",
                        interactive: {
                            type: "button",
                            body: {
                                text: bubbleValues[bubbleValues.length - 1],
                            },
                            action: {
                                buttons: [
                                    {
                                        type: "reply",
                                        reply: {
                                            id: "unique-postback-id-1",
                                            title: buttonValues[0],
                                        },
                                    },
                                    {
                                        type: "reply",
                                        reply: {
                                            id: "unique-postback-id-2",
                                            title: buttonValues[1],
                                        },
                                    },
                                ],
                            },
                        },
                    };

                    responseData = await axios.post(`https://multichannel.qiscus.com/whatsapp/v1/${this.appConfigService.QISCUS_APP_ID}/${this.appConfigService.QISCUS_CHANNEL_ID}/messages`, data, config).catch((v) => {
                        throw new Error(v);
                    });
                }



            } else {
                data.type = "text"
                data.text = {
                    body: text
                }
                responseData = await axios.post(`https://multichannel.qiscus.com/whatsapp/v1/${this.appConfigService.QISCUS_APP_ID}/${this.appConfigService.QISCUS_CHANNEL_ID}/messages`, data, config).catch((v) => {
                    throw new Error(v);
                });
            }
            // await this.logsDbmodels.OutgoingMessage.OutgoingMessage.update({
            //     id: pushMessageId
            // }, {
            //     status,
            //     sendDate: submitDate,
            //     reason
            // })
            return responseData.data
        } catch (error) {
            console.log("error");
            console.log(error);

            throw new Error("Push Reply" + error)
        }
    }
}