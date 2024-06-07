import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateLoginUrl, getToken } from "../../spotify";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        await getToken(code);
        navigate("/home");
      }
    };

    handleLogin();
  }, [navigate]);

  useEffect(() => {
    generateLoginUrl().then((url) => {
      setLoginUrl(url);
    });
  }, []);

  return (
    <div className="login">
      <img
        src="https://music-b26f.kxcdn.com/wp-content/uploads/2017/06/635963274692858859903160895_spotify-logo-horizontal-black.jpg"
        alt="Spotify logo"
      />
      {loginUrl ? <a href={loginUrl}>LOGIN WITH SPOTIFY</a> : null}
    </div>
  );
};

export default Login;
