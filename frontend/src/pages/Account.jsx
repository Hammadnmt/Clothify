import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";

export default function Account() {
  const { userInfo } = useSelector((state) => state.auth);
  const { type } = useParams();
  const [accountType, setAccountType] = useState(type || "signin");

  useEffect(() => {
    if (!["signin", "signup"].includes(type)) {
      setAccountType("signin");
    } else {
      setAccountType(type);
    }
  }, [type]);

  if (userInfo && !userInfo.emailVerified) {
    return <Navigate to={"/check-email"} replace />;
  } else if (userInfo && userInfo.emailVerified) {
    return <Navigate to={"/"} replace />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <Tabs
          value={accountType}
          onValueChange={setAccountType}
          defaultValue={accountType || "signin"}
          className="w-full"
        >
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger
              value="signin"
              className="w-1/2 text-center font-medium"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="w-1/2 text-center font-medium"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
