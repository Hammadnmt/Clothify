import { Mail, PencilIcon, Phone, Upload, VerifiedIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";

export default function ProfileSection({ user, onUpdateProfile }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: null,
  });

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);

    // Only append image if a new one was selected
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    setIsEditing(false);
    setImagePreview(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: null,
    });

    // Cleanup any object URLs we created
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="relative group" onClick={handleImageClick}>
          <Avatar className="w-24 h-24 cursor-pointer">
            <AvatarImage
              src={imagePreview || user.image || "/placeholder.jpg"}
            />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-8 h-8 text-white" />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {!isEditing ? (
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-500">{user.phone}</p>
              </div>
              {/* <Button variant="outline" onClick={() => setIsEditing(true)}>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </Button> */}
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.emailVerified ? (
                  <Badge
                    variant="success"
                    className={"flex items-center gap-2"}
                  >
                    Email{" "}
                    <VerifiedIcon className="stroke-white fill-blue-600" />
                  </Badge>
                ) : (
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-destructive"
                    onClick={() =>
                      navigate("/check-email", { state: { fromProfile: true } })
                    }
                  >
                    Verify Email
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {user.phoneVerified ? (
                  <Badge
                    variant="success"
                    className={"flex items-center gap-2"}
                  >
                    Phone{" "}
                    <VerifiedIcon className="stroke-white fill-blue-600" />
                  </Badge>
                ) : (
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-destructive"
                    onClick={() =>
                      navigate("/verify-phone", {
                        state: { phone: user.phone },
                      })
                    }
                  >
                    Verify Phone
                  </Button>
                )}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-blue-600 underline"
                  onClick={() => navigate("/change-phone")}
                >
                  Change Phone Number
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {!user.emailVerified && (
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => onRequestVerification("email")}
                    >
                      Verify your email address
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="space-y-1">
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {!user.phoneVerified && (
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => onRequestVerification("phone")}
                    >
                      Verify your phone number
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
