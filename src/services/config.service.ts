import { readFileSync } from 'fs';

export class ConfigService {
  public config: any;
  constructor() {
    this.config = JSON.parse(
      readFileSync(process.env.CONFIG_FILE_PATH, {
        encoding: 'utf8',
      }).toString(),
    );
  }

  getMasterPublicKey() {
    return this.config.masterPublicKey;
  }
}
