import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Nav() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [user, setUser] = useState();

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <nav
        id="desktop"
        className={
          location.pathname === "/about" || location.pathname === "/about/"
            ? "fixed-nav"
            : ""
        }
      >
        <a href="/" className="no-select logo-text">
          PoopChat!
        </a>
        <div className="user-info">
          {user && user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              className="pfp no-select"
            />
          )}
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              background: "blue",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {user && user?.user_metadata?.email.split("@")[0][0].toUpperCase()}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
