import { AppConfigService } from '@common/config/api/config.service';
import { CommonService } from '@common/services/services.service';
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import * as moment from 'moment';
import * as Jimp from "jimp";
import * as fs from "fs/promises"
import * as appRoot from "app-root-path";
// import { LogsDbModel } from 'src/datasource/databases/logs-db/interfaces/model.interface';
// import { LogsDbService } from 'src/datasource/databases/logs-db/logs-db.service';
import { ProjectDbModel } from 'src/datasource/databases/project-db/interfaces/model.interface';
import { ProjectDbService } from 'src/datasource/databases/project-db/project-db.service';
import { IDownloadPhoto } from 'src/dto/common.dto';
import { IComponents, IIncomingMessageQueue, IPushReplyIndividual, IPushTemplateParams, IQiscusBody, IQiscusDownloadPhotoQueue, IQiscusPush, IQiscusUploadMediaText } from 'src/dto/qiscus.dto';
import { Readable } from 'stream';
import axios from 'axios';
import * as FormData from "form-data";
// import { changePhone } from 'src/common/services/services.service'

@Injectable()
export class QiscusService {
    // private logsDbmodels: LogsDbModel;
    private projectDbModels: ProjectDbModel;

    constructor(
        // private readonly logsDbService: LogsDbService,
        private readonly projectDbService: ProjectDbService,
        private readonly commonService: CommonService,
        private readonly appConfigService: AppConfigService,
        @InjectQueue("push_template") private pushTemplateQueue: Queue,
    ) {
        // this.logsDbmodels = this.logsDbService.getLogsDbModels()
        this.projectDbModels = this.projectDbService.getProjectDbModels()
    }

    async pushTemplate(params: IPushTemplateParams) {
        const { header, body, templateName, templateNameSpace, to } = params
        let components: IComponents[] = []
        for (let index = 0; index < header.length; index++) {
            let { link, replacementText, type } = header[index];
            let componentIdx = components.findIndex(v => v.type === "header")
            if (componentIdx < 0) {
                components.push({
                    type: "header",
                    parameters: []
                })
                componentIdx = components.findIndex(v => v.type === "header")
            }
            if (type === "document" || type === "image" || type === "video") {
            }

            if (type === "text") {
                components[componentIdx].parameters.push({
                    type,
                    text: replacementText
                })
            }
        }
        for (let index = 0; index < body.length; index++) {
            const { replacementText } = body[index];
            let componentIdx = components.findIndex(v => v.type === "body")
            if (componentIdx < 0) {
                components.push({
                    type: "body",
                    parameters: []
                })
                componentIdx = components.findIndex(v => v.type === "body")
            }
            components[componentIdx].parameters.push({
                type: "text",
                text: replacementText
            })
        }

        await this.pushTemplateQueue.add({
            templateName,
            templateNameSpace,
            components,
            to
        }, {
            attempts: 10,
            backoff: 5000,
            timeout: 60000,
        })
    }

    async pushMessageDB() {
        const blast = await this.projectDbModels.Blast.Blast.createQueryBuilder('bl')
            .select('bl.id', 'id')
            .addSelect('bl.name', 'name')
            .addSelect('bl.phone', 'phone')
            .addSelect('bl.code_voucher', 'code_voucher')
            .where('bl.status = 0')
            .getRawMany();

        if (blast[0] === undefined) {
            throw new NotFoundException("Tidak ada blast!")
        }

        for (let i = 0; i < blast.length; i++) {
            const { phone, code_voucher, id } = blast[i];
            const convPhone = this.commonService.changePhone(phone, '62')
            const param: IPushTemplateParams = {
                header: [],
                to: convPhone,
                templateNameSpace: process.env.QISCUS_TEMPLATE_NAMESPACE,
                templateName: process.env.QISCUS_TEMPLATE_NAME,
                body: [
                    {
                        replacementText: code_voucher
                    }
                ]
            }
            try {
                await this.pushTemplate(param)
                await this.projectDbModels.Blast.Blast.update({ id: id }, { status: 1 })
            } catch (error) {
                console.log(error)
                throw new NotFoundException("push ERROR! :", error)
            }
        }

        return "SUCCESS!"

        // for (let i = 0; i < entries.length; i++) {
        //     const { id, sender, status } = entries[i];

        //     if (sender !== previousSender) {
        //         if (!(sender in sequenceNumbers)) {
        //             sequenceNumbers[sender] = 1;
        //         }

        //         const body = {
        //             to: sender
        //         };

        //         await axios.post(`${process.env.QISCUS_PUSH_WA_URL}/endSession`, body).catch(v => {
        //             throw new Error(v);
        //         });

        //         sequenceNumbers[sender]++;
        //     }
        //     previousSender = sender;

        //     if (status === 2) {
        //         // update to valid
        //         await this.projectDbModels.Entries.Entries.update({ id: id }, { status: 1, is_valid: 1 })
        //     } else {
        //         // update invalid reason = expired session
        //         await this.projectDbModels.Entries.Entries.update({ id: id }, { status: 1, is_valid: 0, invalidReason: { id: 1 } })
        //     }
        // }

        // return {
        //     result: entries,
        // };
    }
}

