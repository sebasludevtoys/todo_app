import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div className='relative h-screen bg-gray-800 flex justify-center items-center'>
      <button
        className='bg-slate-400 px-3 py-2 rounded-sm'
        onClick={() =>
          signIn("github", { callbackUrl: "http://localhost:3000" })
        }
      >
        Login
      </button>
    </div>
  );
};

Login.authPage = true;

export default Login;
