import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useLogin } from "~/hooks/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login to Bus POS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Loading..." : "Login"}
            </Button>
            {loginMutation.isError && (
              <p className="text-sm text-red-500">Invalid credentials</p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start">
          <div className="text-sm text-gray-600 border-t pt-4 w-full">
            <p className="font-semibold mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded p-2 bg-gray-50">
                <p className="font-medium">Admin</p>
                <p>Username: admin user</p>
                <p>Password: passpass</p>
              </div>
              <div className="border rounded p-2 bg-gray-50">
                <p className="font-medium">Agent</p>
                <p>Username: agent user</p>
                <p>Password: passpass</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
