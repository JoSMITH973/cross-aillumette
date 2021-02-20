import './App.css';

function App() {
    let lineArray =     "*********"
    let firstLine, secondLine, thirdLine ,fourthLine, matchLefts, rangeLine, rangeMatch, countAiError
    let arena = [lineArray,firstLine,secondLine,thirdLine,fourthLine,lineArray]
  return (
    <div id="Arena">
      <p id="LineBreak">*******</p>
      <p id="Line1">*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;*</p>
      <p id="Line2">*&nbsp;&nbsp;|||&nbsp;&nbsp;*</p>
      <p id="Line3">*&nbsp;|||||&nbsp;*</p>
      <p id="Line4">*|||||||*</p>
      <p id="LineBreak">*******</p>
    </div>
  );
}

export default App;
