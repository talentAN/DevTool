import React from "react";
import DevTools from "./components/DevTool";
function App() {
  const requester = async (data: any) => data;
  const handleRes = (res: any) => console.log(res);

  return (
    <div className="App" id="javascript-editor">
      <DevTools requester={requester} handleRes={handleRes} />
    </div>
  );
}

export default App;
