import { registerAs } from "@nestjs/config";
export default registerAs("app", () => ({
    ENV: process.env.NODE_ENV,
    PORT: process.env.APP_PORT,
    VERSION: process.env.APP_VERSION,
    NAME_PROGRAM: process.env.NAME_PROGRAM,
    PROGRAM_ID: process.env.PROGRAM_ID,
    KEYWORD: process.env.KEYWORD,
    DOMAIN_APP: process.env.DOMAIN_APP,
    API_USER: process.env.API_USER,
    API_KEY: process.env.API_KEY,
    VALIDATION_SERVICE_URL: process.env.VALIDATION_SERVICE_URL,
    WHATSAPP_SERVICE_URL: process.env.WHATSAPP_SERVICE_URL,
    QISCUS_WA_GATEWAY_NUMBER: process.env.QISCUS_WA_GATEWAY_NUMBER,
    QISCUS_APP_ID: process.env.QISCUS_APP_ID,
    QISCUS_SECRET_KEY: process.env.QISCUS_SECRET_KEY,
    QISCUS_CHANNEL_ID: process.env.QISCUS_CHANNEL_ID,
    QISCUS_TOKEN_UPLOAD: process.env.QISCUS_TOKEN_UPLOAD,
    QISCUS_TEMPLATE_NAMESPACE: process.env.QISCUS_TEMPLATE_NAMESPACE,
    QISCUS_TEMPLATE_NAME_APPROVED_WA: process.env.QISCUS_TEMPLATE_NAME_APPROVED_WA,
    QISCUS_TEMPLATE_NAME_REJECT_WA: process.env.QISCUS_TEMPLATE_NAME_REJECT_WA,
    QISCUS_SEND_MESSAGE_URL: process.env.QISCUS_SEND_MESSAGE_URL,
    QISCUS_UPLOAD_URL: process.env.QISCUS_UPLOAD_URL,
}));