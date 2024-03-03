const Terminal = {
  terminalElement: document.querySelector('#terminal'),
  historyElement: document.querySelector('#terminal .history'),
  promptElement: document.querySelector('#terminal .prompt'),

  terminalFocus: true,
  history: [],
  cmdHistory: [],
  cmdHistoryIndex: 0,
  cmd: '',
};
