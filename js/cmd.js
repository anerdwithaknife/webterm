const runCmd = () => {
  const [command, ...args] = cmd.split(' ');

  switch (command) {
    case 'ls': run_ls(); break;
    case 'pwd': run_pwd(); break;
    case 'cd': run_cd(args); break;
    case 'clear': run_clear(); break;
    case 'cat': run_cat(args); break;
    default:
      history.push(`err: ${command}: command not found`);
      break;
  }
}

const run_cd = (args) => {
  if (args.length === 0) {
    currentDir = 'home/user';
    return;
  }

  if (args[0] === '..') {
    currentDir = currentDir.split('/').filter(Boolean).slice(0, -1).join('/');
    return;
  }

  let targetDir = args[0].startsWith('/')
    ? args[0].split('/').filter(Boolean).join('/')
    : `${currentDir}/${args[0]}`.split('/').filter(Boolean).join('/');

  const allowedDirs = getAllDirs();

  if (allowedDirs.find((d) => d.startsWith(`/${targetDir}/`))) {
    currentDir = targetDir;
  } else {
    history.push(`cd: ${args[0]}: No such directory`);
  }
};

const run_clear = () => {
  history = [];
  historyElement.innerHTML = '';
};

const run_pwd = () => {
  history.push('/' + currentDir);
};

const run_ls = () => {
  const dirs = getDirs(currentDir);
  const files = getFiles(currentDir);
  [...dirs, ...files].forEach((f) => history.push(f));
};

const run_cat = (args) => {
  if (args.length === 0) {
    history.push('cat: missing file argument');
    return;
  }

  const file = args[0].startsWith('/') ? args[0] : `/${currentDir}/${args[0]}`;

  if (!filesystem[file]) {
    history.push(`cat: ${args[0]}: No such file`);
    return;
  }
  filesystem[file].split('\n').forEach((line) => history.push(line));
};

