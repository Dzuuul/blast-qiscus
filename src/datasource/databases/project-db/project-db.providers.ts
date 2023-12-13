import { ProjectDBConfigService } from "@common/config/db/project-db/config.service";
import { createConnection } from "typeorm";
export const ProjectDBProvider = [
    {
        provide: "PROJECT_DB_CONNECTION",
        inject: [ProjectDBConfigService],
        useFactory: async (projectDBConfigService: ProjectDBConfigService) =>
            await createConnection(projectDBConfigService.typeORMConfig,),
    },
];