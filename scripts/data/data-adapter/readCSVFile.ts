import * as fastCsv from 'fast-csv';
import * as fs from 'fs';
import { LoggerService } from '~common/logging';

export const readCsvFile = (
  filePath: string,
  transformItem: (item: any) => any,
  logger: LoggerService,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(fastCsv.parse({ headers: true }))
      .on('data', (item) => {
        results.push(transformItem(item));
      })
      .on('end', () => {
        logger.log(`CSV file at ${filePath} successfully processed`);

        resolve(results);
      })
      .on('error', (error) => {
        logger.log(`CSV file at ${filePath} successfully processed`);

        reject(error);
      });
  });
};
