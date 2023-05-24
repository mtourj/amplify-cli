import * as path from 'path';
import * as fs from 'fs-extra';
import { parseSyml, stringifySyml } from '@yarnpkg/parsers';

const removePkgFetchChecksum = (yarnLockPath: string): void => {
  const yarnLockFile = fs.readFileSync(yarnLockPath, 'utf8');
  const yarnLockData = parseSyml(yarnLockFile);

  const pkgFetchKey = Object.keys(yarnLockData).find((key) => key.startsWith('pkg-fetch@https://github.com/aws-amplify/pkg-fetch'));

  if (pkgFetchKey) {
    delete yarnLockData[pkgFetchKey].checksum;
    const header =
      '# This file is generated by running "yarn install" inside your project.\n# Manual changes might be lost - proceed with caution!\n\n';
    fs.writeFileSync(yarnLockPath, `${header}${stringifySyml(yarnLockData)}`);
  }
};

removePkgFetchChecksum(path.join(process.cwd(), '..', 'yarn.lock'));
