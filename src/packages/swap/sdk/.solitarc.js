const programName = 'jpludex'

// TODO: get program id by `programName`
const programId = 'GEKHqpoYKtPZusV2CS7fjcfStszxDUGsnuZXonxd5tba'

const os = require("os");
const path = require('path');
const programDir = path.join(__dirname, '..', '..', 'programs', programName);
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src'); // , 'generated');
const binaryInstallDir = path.join(os.homedir(), '.cargo');
// const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
  idlGenerator: 'anchor',
  programName,
  programId,
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};
