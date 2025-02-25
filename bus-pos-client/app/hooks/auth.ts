import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "~/lib/api";
import { LoginCredentials, User } from "~/utils/types";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post("/users/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate({ to: "/admin/bookings" });
      } else {
        navigate({ to: "/agent/trip" });
      }
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],

    queryFn: async () => {
      const { data } = await api.get("/users/profile");
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    },
  });
};

export const useRequireAuth = (allowedRoles?: string[]) => {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();
  console.log("useRequireAuth");

  useEffect(() => {
    if (!isLoading) {
      console.log("userlog", user);
      if (!user) {
        navigate({ to: "/login" });
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        navigate({
          to: user.role === "admin" ? "/admin/bookings" : "/agent/trip",
        });
      }
    }
  }, [user, isLoading, allowedRoles, navigate]);

  return { user, isLoading };
};

export const useLogout = () => {
  const navigate = useNavigate();
  console.log("useLogout");
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate({ to: "/login" });
  };
};

export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
