import { Controller, UseInterceptors, Post, Get, Body, Ip } from '@nestjs/common';
import { QiscusService } from './qiscus.service';
import { TransformInterceptor } from "@common/interceptors/transform.interceptor";
import { IPushReply, IPushReplyIndividual, IPushTemplateParams, IQiscusBody, IQiscusPush } from 'src/dto/qiscus.dto';

@UseInterceptors(TransformInterceptor)
@Controller('api/qiscus')
export class QiscusController {
    constructor(
        private readonly qiscusService: QiscusService,
    ) { }

    // @Post("")
    // async onIncoming(@Body() body: IQiscusBody, @Ip() ip: string) {
    //     return this.qiscusService.onIncoming(body, ip)
    // }

    @Post("/pushMessage")
    async pushMessage(@Body() body: IPushTemplateParams) {
        return this.qiscusService.pushTemplate(body)
    }

    @Get("/bulkPushMessage")
    async bulkPushMessage() {
        return this.qiscusService.pushMessageDB()
    }
}
