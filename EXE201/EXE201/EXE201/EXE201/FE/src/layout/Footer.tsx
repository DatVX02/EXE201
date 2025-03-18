import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Diable. All Rights Reserved.</p>
        <p className="mt-2">
          Follow us on:
          <a
            href="https://www.facebook.com/profile.php?id=61572026472325"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 ml-2 hover:underline"
          >
            Facebook
          </a>{" "}
          |{" "}
          <a
            href="https://www.instagram.com/diabecare.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 ml-2 hover:underline"
          >
            Instagram
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
