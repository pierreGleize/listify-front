import React, { useState } from "react";
import styles from "../../styles/auth/Login_Signup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { UseAppDispatch } from "@/app/redux/store";
import { login } from "@/app/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { addAnBoard, selectedBoard } from "@/app/redux/slices/boardSlice";

interface SignupProps {
  handleSection: (name: string) => void;
}

const Signup: React.FC<SignupProps> = ({ handleSection }) => {
  const [firstname, setFirstname] = useState("Pierre");
  const [lastname, setLastname] = useState("Gleize");
  const [email, setEmail] = useState("kiki1@gmail.com");
  const [password, setPassword] = useState("kiki");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = UseAppDispatch();

  const router = useRouter();

  function validateEmail(email: string): boolean {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  const handleSignup = async () => {
    if (!firstname || !lastname || !email || !password) {
      setError(true);
      setErrorMessage("Tous les champs doivent être repmlis");
      return;
    }

    if (!validateEmail(email)) {
      setError(true);
      setErrorMessage("L'adresse e-mail n'est pas au bon format");
      return;
    }
    try {
      setError(false);

      const response = await fetch("http://localhost:3001/users/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(true);
        setErrorMessage(data.message);
      }

      if (data.result) {
        dispatch(login(data.user));
        dispatch(addAnBoard(data.boardUser));
        dispatch(selectedBoard(data.boardUser._id));
        setEmail("");
        setFirstname("");
        setLastname("");
        setPassword("");
        router.push(`/board/${data.boardUser._id}`);
      }
    } catch (error) {
      setError(true);
      setErrorMessage(
        "Une erreur s'est produite lors de votre tentative de création de compte"
      );
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Se créer un compte</h2>
      <div className={styles.inputContainer}>
        <FontAwesomeIcon
          icon={faUser}
          style={{ color: "#ffffff" }}
          className={styles.icon}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Votre prénom"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div className={styles.inputContainer}>
        <FontAwesomeIcon
          icon={faUser}
          style={{ color: "#ffffff" }}
          className={styles.icon}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Votre nom de famille"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
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
      <button type="submit" className={styles.btnSubmit} onClick={handleSignup}>
        Continuer
      </button>
      <p>
        Vous avez déjà un compte ?{" "}
        <span
          onClick={() => handleSection("login")}
          className={styles.changeForm}
        >
          Se connecter
        </span>
      </p>
    </div>
  );
};

export default Signup;
