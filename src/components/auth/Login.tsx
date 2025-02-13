"use client";
import React, { useState } from "react";
import styles from "../../styles/auth/Login_Signup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "@/app/redux/store";
import { login } from "@/app/redux/slices/userSlice";
import { addBoards, selectedBoard } from "@/app/redux/slices/boardSlice";
import { useRouter } from "next/navigation";

interface LoginProps {
  handleSection: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ handleSection }) => {
  const [email, setEmail] = useState("kiki@gmail.com");
  const [password, setPassword] = useState("kiki");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  function validateEmail(email: string): boolean {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  const handleLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      setError(true);
      setErrorMessage("Tous les champs doivent être remplis");
      return;
    }

    if (!validateEmail(email)) {
      setError(true);
      setErrorMessage("Votre adresse e-mail n'est pas au bon format");
      return;
    }
    try {
      setError(false);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/users/signin`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(true);
        setErrorMessage(data.message);
        return;
      }

      if (data.result) {
        setEmail("");
        setPassword("");

        dispatch(login(data.user));
        if (data.boards.length === 0) {
          router.push("/board");
        } else {
          dispatch(addBoards(data.boards));

          dispatch(selectedBoard(data.boards[0]._id));
          router.push(`board/${data.boards[0]._id}`);
        }
      }
    } catch (error) {
      setError(true);
      setErrorMessage("Une erreur s'est produite lors de la connexion");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Se connecter</h2>
      <div className={styles.inputContainer}>
        <FontAwesomeIcon
          icon={faEnvelope}
          style={{ color: "#ffffff" }}
          className={styles.icon}
        />
        <input
          type="email"
          className={styles.input}
          placeholder="Votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.inputContainer}>
        <FontAwesomeIcon
          icon={faKey}
          style={{ color: "#ffffff" }}
          className={styles.icon}
        />
        <input
          type="password"
          className={styles.input}
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <span className="error-message">{errorMessage}</span>}
      <button type="submit" className={styles.btnSubmit} onClick={handleLogin}>
        Continuer
      </button>
      <p>
        Vous n{`'`}avez pas encore de compte ?{" "}
        <span
          onClick={() => handleSection("signup")}
          className={styles.changeForm}
        >
          Se créer un compte
        </span>
      </p>
    </div>
  );
};

export default Login;
