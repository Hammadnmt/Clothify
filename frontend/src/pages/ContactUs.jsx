import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MailIcon, MapPinCheckIcon, PhoneCallIcon } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 min-h-screen flex items-center justify-center">
      <div className="container max-w-5xl p-5 md:p-10 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Contact <span className="text-pink-600">Clothify</span>
        </h2>
        <p className="text-gray-600 text-center mb-8">
          We'd love to hear from you! Reach out for inquiries, feedback, or
          support.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            <div className="flex items-center gap-4">
              <MailIcon className="text-pink-600 w-6 h-6" />
              <p className="text-gray-700">support@clothify.com</p>
            </div>
            <div className="flex items-center gap-4">
              <PhoneCallIcon className="text-pink-600 w-6 h-6" />
              <p className="text-gray-700">+1 234 567 890</p>
            </div>
            <div className="flex items-center gap-4">
              <MapPinCheckIcon className="text-pink-600 w-6 h-6" />
              <p className="text-gray-700">123 Fashion Lane, New York, NY</p>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="flex-1"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="flex-1"
                  required
                />
              </div>
              <Textarea
                placeholder="Your Message"
                rows={10}
                className="w-full"
                required
              />
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white w-full"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
