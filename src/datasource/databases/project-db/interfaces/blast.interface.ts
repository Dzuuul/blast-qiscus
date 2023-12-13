import { Repository } from "typeorm";
import { Blast } from "../models/blast.entity";

export interface BlastModel {
    Blast: Repository<Blast>;
}
