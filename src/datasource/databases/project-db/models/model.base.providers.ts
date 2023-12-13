
import { Connection } from 'typeorm';
import { Blast } from './blast.entity';

export const baseModelProviders = [
    {
        provide: "BLAST_MODEL",
        useFactory: (connection: Connection) => {
            return {
                Blast: connection.getRepository(Blast),
            };
        },
        inject: ["PROJECT_DB_CONNECTION"],
    },
]