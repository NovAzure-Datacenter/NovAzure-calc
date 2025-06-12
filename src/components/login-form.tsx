'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { login, getAllUsers, createDemoUser } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useUser } from "@/hooks/useUser"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDebugLoading, setIsDebugLoading] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const router = useRouter();
  const { updateUser } = useUser();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = await login({ email, password });
      

      if (result.error) {
        toast.error("Login Failed", {
          description: result.error
        });
        return;
      }

      if (result.success && result.user) {
        updateUser(result.user);
        toast.success("Login Successful", {
          description: "Welcome back!"
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDebug() {
    setIsDebugLoading(true);
    try {
      const result = await getAllUsers();
      if (result.error) {
        toast.error("Failed to fetch users", {
          description: result.error
        });
        return;
      }

      if (result.success) {
        toast.success("Users found", {
          description: `Found ${result.users.length} users`
        });
        console.log("All users:", result.users);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch users"
      });
    } finally {
      setIsDebugLoading(false);
    }
  }

  async function handleCreateDemo() {
    setIsCreatingDemo(true);
    try {
      const result = await createDemoUser();
      if (result.error) {
        toast.error("Failed to create demo user", {
          description: result.error
        });
        return;
      }

      if (result.success) {
        toast.success("Demo user created", {
          description: "Email: demo@example.com, Password: demo123"
        });
        console.log("Demo user created:", result.user);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create demo user"
      });
    } finally {
      setIsCreatingDemo(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  Login with Google
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={handleDebug}
                    disabled={isDebugLoading || isCreatingDemo}
                  >
                    {isDebugLoading ? "Finding..." : "Find Users"}
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={handleCreateDemo}
                    disabled={isDebugLoading || isCreatingDemo}
                  >
                    {isCreatingDemo ? "Creating..." : "Create Demo"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
