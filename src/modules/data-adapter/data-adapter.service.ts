import { Injectable } from '@nestjs/common';
import { readCsvFile } from './readCSVFile'; // Adjust the path according to your project structure
import { ProjectCategory } from '@prisma/client';
import { ProjectsRepository } from '~modules/projects/projects.repository';
import { LoggerService } from '~common/logging';

@Injectable()
export class DataAdapterService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly logger: LoggerService,
  ) {
    // Uncomment this if you want to import all data at once
    // this.importAllCSVData();
  }

  async importAllCSVData() {
    await this.importProjects();
    await this.importFundraisers();
    await this.importInvestors();
    await this.importProjectsDune();
  }

  private readonly basePath = 'src/modules/data-adapter/csv';

  async importProjects() {
    const projects = await this.readProjectsCsvFile();
    try {
      return this.projectsRepository.batchUpsertProjects(projects);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async importFundraisers() {
    try {
      const fundraisers = await this.readFundraisersFromCsvFile();
      console.log('fundraisers', fundraisers);

      return this.projectsRepository.batchUpsertFundraisers(fundraisers);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async importInvestors() {
    try {
      const investors = await this.readInvestorsFromCsvFile();
      return this.projectsRepository.batchUpsertInvestors(investors);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async importProjectsDune() {
    try {
      const duneData = await this.readProjectsDuneFromCsvFile();
      return this.projectsRepository.upsertProjectDuneQueryIdentifiers(duneData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async readProjectsCsvFile(): Promise<any[]> {
    const filePath = `${this.basePath}/DePIN-Projects.csv`;

    return readCsvFile(
      filePath,
      (item) => ({
        ...item,
        chain: item.chain || null,
        verified: Boolean(item.verified),
        category: item.category || ProjectCategory.BLOCKCHAIN_INFRA,
      }),
      this.logger,
    );
  }

  async readFundraisersFromCsvFile(): Promise<any[]> {
    const filePath = `${this.basePath}/DePIN-Fundraises.csv`;
    return readCsvFile(
      filePath,
      (item) => ({
        ...item,
      }),
      this.logger,
    );
  }

  async readInvestorsFromCsvFile(): Promise<any[]> {
    const filePath = `${this.basePath}/DePIN-Investors.csv`;
    return readCsvFile(
      filePath,
      (item) => ({
        ...item,
      }),
      this.logger,
    );
  }

  async readProjectsDuneFromCsvFile(): Promise<any[]> {
    const filePath = `${this.basePath}/DePIN-Projects-Dune.csv`;
    return readCsvFile(
      filePath,
      (item) => {
        const { id, ...rest } = item;
        return {
          ...rest,
          projectId: id,
        };
      },
      this.logger,
    );
  }
}
