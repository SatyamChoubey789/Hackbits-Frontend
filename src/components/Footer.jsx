import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HB</span>
            </div>
            <span className="text-xl font-bold text-white">HackBits</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering the next generation of innovators through creativity, 
            collaboration, and cutting-edge technology.
          </p>
        </div>

        {/* Policy Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/privacy-policy" className="hover:text-primary-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-primary-400">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-primary-400">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li>
              📧{" "}
              <a href="mailto:hackbitsofficialteam@gmail.com" className="hover:text-primary-400">
                hackbitsofficialteam@gmail.com
              </a>
            </li>
            <li>
              📱{" "}
              <a href="tel:+919555040155" className="hover:text-primary-400">
                +91 95550 40155
              </a>
            </li>
            <li>
              📍 Lovely Professional University<br />
              Block 34, Jalandhar, Punjab, India
            </li>
          </ul>
        </div>

        

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HackBits — All Rights Reserved.
      </div>
    </footer>
  );
};
