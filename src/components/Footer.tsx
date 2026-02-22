import {
  Heart,
  ShoppingBag,
  Truck,
  Clock,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 text-white relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.25),_transparent_40%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide">
                Fresh<span className="text-green-300">Mart</span>
              </h2>
            </div>

            <p className="text-sm text-green-100 leading-relaxed">
              Fresh groceries delivered to your doorstep with premium quality,
              affordable prices, and lightning-fast service.
            </p>

            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-green-500 transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-green-200">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["About Us", "Products", "Terms", "Privacy", "FAQ"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-green-100 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-green-200">
              Contact Us
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-green-300" />
                <span className="text-green-100">Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-300" />
                <a
                  href="tel:+923001234567"
                  className="text-green-100 hover:text-white transition"
                >
                  +92 300 1234567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-300" />
                <a
                  href="mailto:info@freshmart.com"
                  className="text-green-100 hover:text-white transition"
                >
                  info@freshmart.com
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-green-200">
              Why Choose Us
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl hover:bg-green-600/40 transition-all duration-300">
                <Truck className="w-6 h-6 text-green-300" />
                <div>
                  <p className="font-semibold">Free Delivery</p>
                  <p className="text-xs text-green-200">
                    On orders above Rs. 1000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl hover:bg-green-600/40 transition-all duration-300">
                <Clock className="w-6 h-6 text-green-300" />
                <div>
                  <p className="font-semibold">30 Minute Delivery</p>
                  <p className="text-xs text-green-200">
                    Fast & reliable service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-green-700/50 bg-emerald-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-green-200">
          <p>© {new Date().getFullYear()} FreshMart. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> in
            Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
