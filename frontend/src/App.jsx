import { AuthProvider } from "./context/AuthContext";
import Role from "./Role";

export default function App() {
  return (
    <AuthProvider>
      <Role />
    </AuthProvider>
  );
}
