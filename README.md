# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Button navigation
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

<button onClick={() => navigate("/signin")}>
  Go to Signin
</button>


import axios from "axios";

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmpassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:8080/api/signup",
      formData
    );

    setSuccess(res.data); // message from backend
    setError("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {
    setError(err.response?.data || "Signup failed");
  } finally {
    setLoading(false);
  }
};