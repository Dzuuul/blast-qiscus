import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDbService } from './project-db.service';

describe('ProjectDbService', () => {
  let service: ProjectDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectDbService],
    }).compile();

    service = module.get<ProjectDbService>(ProjectDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
