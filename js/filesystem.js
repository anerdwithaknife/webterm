let currentDir = '';
let filesystem = {
  '/etc/hosts': 'localhost         127.0.0.1\nipv6-localhost    ::1\n',
  '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\n',
  '/home/user/.hidden': 'Top Secret\n',
  '/home/user/hello.txt': 'Hello, World!\n',
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


