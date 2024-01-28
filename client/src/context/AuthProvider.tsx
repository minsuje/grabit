// import { createContext, ReactNode, useState } from 'react';

// type Props = {
//   children?: ReactNode;
// };

// type IAuthContext = {
//   authenticated: boolean;
//   setAuthenticated: (newState: boolean) => void;
// };

// const initialValue = {
//   authenticated: false,
//   setAuthenticated: () => {},
// };
// const AuthContext = createContext<IAuthContext>(initialValue);

// const AuthProvider = ({ children }: Props) => {
//   const [authenticated, setAuthenticated] = useState(initialValue.authenticated);

//   return <AuthContext.Provider value={{ authenticated, setAuthenticated }}>{children}</AuthContext.Provider>;
// };

// export { AuthContext, AuthProvider };

import { ReactNode, createContext, useState } from 'react';

type Props = {
  children?: ReactNode;
};

type IAuth = {
  auth: object;
  setAuth: (auth: object) => void;
  userid: string;
  accessToken: string;
  refreshToken: string;
};

const initialValue = {
  auth: {},
  setAuth: () => {},
  userid: '',
  accessToken: '',
  refreshToken: '',
};

const AuthContext = createContext<IAuth>(initialValue);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth, userid: '', accessToken: '', refreshToken: '' }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
