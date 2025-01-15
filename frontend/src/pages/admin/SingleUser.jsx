import { useState } from "react";
import { useGetUserQuery } from "@/services/usersApi";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Message from "@/components/Message";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VerificationBadge({ verified }) {
  return verified ? (
    <Badge className="bg-green-100 text-green-800 border-green-200">
      <Check className="w-3 h-3 mr-1" /> Verified
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="bg-yellow-100 text-yellow-800 border-yellow-200"
    >
      <X className="w-3 h-3 mr-1" /> Unverified
    </Badge>
  );
}

export default function SingleUser({ id }) {
  const { data, isLoading, isError } = useGetUserQuery(id);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Message type="error" dismissible={false} title="Unable to load user" />
      </div>
    );
  }

  const { user } = data;
  const hasAddresses = user.addresses && user.addresses.length > 0;

  return (
    <>
      <DrawerHeader>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <Badge
              className={`absolute -bottom-1 right-0 ${
                user.isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <DrawerTitle className="text-xl font-bold">{user.name}</DrawerTitle>
            <DrawerDescription>{user.role}</DrawerDescription>
          </div>
        </div>
      </DrawerHeader>

      <ScrollArea className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-6 mb-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <VerificationBadge verified={user.emailVerified} />
              </div>
              {user.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{user.phone}</span>
                  </div>
                  <VerificationBadge verified={user.phoneVerified} />
                </div>
              )}
            </CardContent>
          </Card>

          {hasAddresses && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Addresses ({user.addresses.length})</span>
                  {user.addresses.length > 1 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentAddressIndex((i) => Math.max(0, i - 1))
                        }
                        disabled={currentAddressIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentAddressIndex((i) =>
                            Math.min(user.addresses.length - 1, i + 1)
                          )
                        }
                        disabled={
                          currentAddressIndex === user.addresses.length - 1
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {user.addresses[currentAddressIndex].fullName}
                  </p>
                  <p className="text-gray-600">
                    {user.addresses[currentAddressIndex].address}
                  </p>
                  <p className="text-gray-600">
                    {user.addresses[currentAddressIndex].city},{" "}
                    {user.addresses[currentAddressIndex].postalCode}
                  </p>
                  <p className="text-gray-600">
                    {user.addresses[currentAddressIndex].country}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  Last login: {formatDate(user.lastLoginAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  Member since: {formatDate(user.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
