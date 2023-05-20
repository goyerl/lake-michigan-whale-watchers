import "./App.css";
import Header from "./components/Header";
// import Home from "./views/Home";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Logout from "./views/Logout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";
import Game from "./views/Game";
import Schedule from "./views/Schedule";

export const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Header title="Lake Michigan Whale Watchers" />
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/game/:gameDate" element={<Game />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
