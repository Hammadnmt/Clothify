import {
  LocateFixed,
  NotebookTabs,
  PencilIcon,
  PlusCircleIcon,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import { Input } from "./ui/input";

export default function AddressSection({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
}) {
  const [isAdd, setIsAdd] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      address: address.address,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    });
  };

  const handleSubmit = () => {
    if (editingAddress) {
      onUpdateAddress(formData, editingAddress._id);
      setEditingAddress(null);
    } else {
      onAddAddress(formData);
      setIsAdd(false);
    }
    setFormData({
      fullName: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
    });
  };

  const handleClose = () => {
    setIsAdd(false);
    setEditingAddress(null);
    setFormData({
      fullName: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
    });
  };

  return (
    <Card className="p-6 shadow-lg">
      {isAdd || editingAddress ? (
        <div className="space-y-4">
          <h4 className="flex items-center gap-2">
            <LocateFixed size={26} />
            {editingAddress ? "Edit Address" : "Add Address"}
          </h4>
          <ShippingAddressForm
            formData={formData}
            setFormData={setFormData}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <NotebookTabs /> Saved Addresses
            </h3>
            <Button onClick={() => setIsAdd(true)}>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{address.fullName}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(address)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDeleteAddress(address._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function ShippingAddressForm({ formData, setFormData, onClose, onSubmit }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        placeholder="Full Name"
        required
      />
      <Input
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Address Line"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="City"
          required
        />
        <Input
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="Postal Code"
          required
        />
      </div>
      <Input
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        placeholder="Country"
        required
      />
      <div className="space-x-2">
        <Button type="submit" variant="secondary">
          Save
        </Button>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
