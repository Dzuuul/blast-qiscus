import { Injectable, Inject } from '@nestjs/common';
import { ProjectDbModel } from './interfaces/model.interface';
import { BlastModel } from './interfaces/blast.interface';

@Injectable()
export class ProjectDbService {
    constructor(
        @Inject('BLAST_MODEL') private blastModel: BlastModel,
    ) { }

    getProjectDbModels(): ProjectDbModel {
        return {
            Blast: this.blastModel,
        }
    }
}
