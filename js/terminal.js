const screen = document.querySelector('#screen');
const terminal = document.querySelector('#terminal');
const promptElement = terminal.querySelector('.prompt');
const historyElement = terminal.querySelector('.history');

let terminalFocus = true;

let history = [];
let cmdHistory = [];
let cmdHistoryIndex = 0;
let cmd = '';

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
        //console.log('KEY> ', e.key, e.keyCode, e.code, e.which, e.charCode, e);
      }
  }

  e.preventDefault();
});


const renderCmd = () => {
  terminal.querySelector('.cmd').innerText = cmd;
}


const renderHistory = () => {
  //let offset = 0;

  history.forEach((hist, i) => {
    const label = 'label-history-' + i;

    if (!document.getElementById(label)) {
      //setTimeout(() => {
      historyElement.innerHTML += `<div id="label-history-${i}">${hist}</div>`;
      promptElement.scrollIntoView();
      //}, 100 * offset);

      //offset++;
    }
  });
}

