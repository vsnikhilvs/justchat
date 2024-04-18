import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Chat from "../../components/Chat";
import { useNavigate } from "react-router-dom";

function Home() {
  let history = useNavigate();
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [againPassword, setAgainPassword] = useState();
  const [accessType, setAccessType] = useState();

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    user ? setUser(user) : setUser(null);
  }

  // async function googleSignIn() {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //   });
  // }

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(data);
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data);
    getUser();
  };

  const handleLogout = async () => {
    const response = await supabase.auth.signOut();
    if (!response.error) history.push("/");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {user ? (
        <>
          <Chat />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <div>
            {/* {user === null && (
            <>
              <p className="log-in-please">If you want to join the chat room, you have to be signed in.</p>
              <button onClick={googleSignIn} className="google-signin">
                <img src="./google-icon.svg" />
                <span>Sign in with google</span>
              </button>
            </>
          )} */}
            <button onClick={() => setAccessType("register")}>Register</button>
            <button onClick={() => setAccessType("login")}>Login</button>
          </div>
          {accessType === "register" && (
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <input
                value={againPassword}
                onChange={(e) => setAgainPassword(e.target.value)}
                placeholder="Password again"
              />
              <button onClick={handleSignUp}>Sign up</button>
            </div>
          )}
          {accessType === "login" && (
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button onClick={handleSignIn}>Sign in</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Home;
