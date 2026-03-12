import React, { createContext, useState, ReactNode } from "react";

// 定义AuthContext的类型
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// 默认值
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
};

// 创建上下文
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// 模拟的管理员账号密码
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// AuthProvider组件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 每次新打开页面都默认未登录，不再从本地存储恢复状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 登录函数
  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // 注销函数
  const logout = () => {
    setIsAuthenticated(false);
  };

  // 提供上下文值
  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};