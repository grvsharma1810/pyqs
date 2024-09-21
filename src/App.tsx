import { Filter } from "./Filter";
import { QuestionUpdate } from "./QuestionUpdate";

function App() {
  const path = window.location.pathname;

  if (path === "/filter") {
    return <Filter />;
  }
  return <QuestionUpdate />;
}

export default App;
