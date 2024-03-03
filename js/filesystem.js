let currentDir = 'home/user';
let filesystem = {
  '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nroot:x:0:0:root:/root:/bin/bash\nroot:x:0:0:root:/root:/bin/bash\nroot:x:0:0:root:/root:/bin/bash\n',
  '/etc/hosts': 'localhost     127.0.0.1\nip6-localhost ip6-loopback\n',
  '/bin/ls': '[BINARY DATA]',
  '/bin/cd': '[BINARY DATA]',
  '/bin/pwd': '[BINARY DATA]',
  '/usr/bin/cat': '[BINARY DATA]',
  '/home/user/.bashrc': 'export PS1="$ "',
};

const getFiles = (cwd) => {
  const filesPattern = currentDir ? new RegExp(`^/${cwd}/[^/]+$`) : new RegExp(`^/[^/]+$`);
  const files = Object.keys(filesystem)
    .filter((f) => f.match(filesPattern))
    .map((f) => f.substring(cwd.length ? cwd.length + 2 : 1));

  return files;
};

const getDirs = (cwd) => {
  const dirsPattern = cwd ? new RegExp(`^/${cwd}/([^/]+/).+`) : new RegExp(`^/([^/]+/).+`);
  const dirs = Object.keys(filesystem)
    .filter((f) => f.match(dirsPattern))
    .map((f) => f.match(dirsPattern)[1])
    .filter((v, i, a) => a.indexOf(v) === i);

  return dirs;
};

const getAllDirs = () => {
  const allDirs = Object.keys(filesystem)
    .map((f) => f.match(/^(.+\/)[^\/]+/)[1])
    .filter((v, i, a) => a.indexOf(v) === i);

  allDirs.unshift('//');
  return allDirs;
}


