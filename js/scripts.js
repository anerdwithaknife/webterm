const terminal = document.querySelector('#terminal');
const promptElement = terminal.querySelector('.prompt');
const historyElement = terminal.querySelector('.history');


let terminalFocus = true;
let history = [];
let cmdHistory = [];
let cmdHistoryIndex = 0;
let cmd = '';
let currentDir = 'home/user';
let filesystem = {
  '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\n',
  '/etc/hosts': 'localhost     127.0.0.1\nip6-localhost ip6-loopback\n',
  '/bin/ls': '[BINARY DATA]',
  '/bin/cd': '[BINARY DATA]',
  '/bin/pwd': '[BINARY DATA]',
  '/usr/bin/cat': '[BINARY DATA]',
  '/home/user/.bashrc': 'export PS1="$ "',
};

const focusTerminal = () => {
  terminalFocus = true;
  promptElement.scrollIntoView();
  promptElement.querySelector('.cursor').hidden = false;
  terminal.focus();
}

const unfocusTerminal = () => {
  terminalFocus = false;
  promptElement.querySelector('.cursor').hidden = true;
}



terminal.addEventListener("click", () => {
  focusTerminal();
});

terminal.addEventListener("keydown", (e) => {
  if (!terminalFocus || e.isComposing || e.keyCode === 229 || e.altKey || e.ctrlKey) {
    return;
  }

  switch (e.key) {
    case 'Enter':
      history.push('$ ' + cmd);
      cmdHistory.push(cmd);
      cmdHistoryIndex = cmdHistory.length;
      runCmd();
      cmd = '';
      renderCmd();
      renderHistory();
      break;
    case 'Backspace':
      if (cmd.length) {
        cmd = cmd.slice(0, -1);
        renderCmd();
      }
      break;
    case 'Escape':
      unfocusTerminal();
      break;
    case 'ArrowUp':
      if (cmdHistoryIndex > 0) {
        cmdHistoryIndex--;
        cmd = cmdHistory[cmdHistoryIndex];
        renderCmd();
      }
      break;
    case 'ArrowDown':
      if (cmdHistoryIndex < cmdHistory.length - 1) {
        cmdHistoryIndex++;
        cmd = cmdHistory[cmdHistoryIndex];
      } else {
        cmd = '';
      }
      renderCmd();
      break;
    default:
      if (e.key.length === 1) {
        cmd += e.key;
        renderCmd();
      } else {
        console.log('KEY> ', e.key, e.keyCode, e.code, e.which, e.charCode, e);
      }
  }

  e.preventDefault();
});

const renderCmd = () => {
  terminal.querySelector('.cmd').innerText = cmd;
}

const renderHistory = () => {
  let offset = 1;

  history.forEach((hist, i) => {
    const label = 'label-history-' + i;

    if (!document.getElementById(label)) {
      setTimeout(() => {
        historyElement.innerHTML += `<div id="label-history-${i}">${hist}</div>`;
        promptElement.scrollIntoView();
      }, 100 * offset);
    }
  });
}


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

  return allDirs;
}

const runCmd = () => {
  const [command, ...args] = cmd.split(' ');

  switch (command) {
    case 'ls':
      const dirs = getDirs(currentDir);
      const files = getFiles(currentDir);
      [...dirs, ...files].forEach((f) => history.push(f));
      break;
    case 'pwd':
      history.push('/' + currentDir);
      break;
    case 'cd':
      if (args.length === 0) {
        currentDir = 'home/user';
        break;
      }

      if (args[0] === '..') {
        currentDir = currentDir.split('/').filter(Boolean).slice(0, -1).join('/');
        break;
      }

      let targetDir = '';

      if (args[0].startsWith('/')) {
        targetDir = args[0].split('/').filter(Boolean).join('/');
      } else {
        targetDir = `${currentDir}/${args[0]}`.split('/').filter(Boolean).join('/');
      }

      const allowedDirs = getAllDirs();
      console.log(allowedDirs, targetDir);

      if (allowedDirs.find((d) => d.startsWith(`/${targetDir}/`))) {
        currentDir = targetDir;
      } else {
        history.push(`cd: ${args[0]}: No such directory`);
      }
      break;
    case 'clear':
      history = [];
      historyElement.innerHTML = '';
      break;
    case 'cat':
      if (args.length === 0) {
        history.push('cat: missing file argument');
        break;
      }

      const file = args[0].startsWith('/') ? args[0] : `/${currentDir}/${args[0]}`;

      if (!filesystem[file]) {
        history.push(`cat: ${args[0]}: No such file`);
        break;
      }
      filesystem[file].split('\n').forEach((line) => history.push(line));
      break;
    default:
      history.push(`err: ${command}: command not found`);
      break;
  }
}
