import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <span className="ml-2 text-lg font-bold">Universidad de Sonora</span>
        </div>
        <nav className="flex space-x-4">
          <Link
            className="text-gray-400 hover:text-white transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-gray-400 hover:text-white transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-gray-400 hover:text-white transition-colors"
            href="#"
          >
            Contact Us
          </Link>
        </nav>
        <p className="text-gray-400 text-sm">
          © 2024 Ciencias de la Computación
        </p>
      </div>
    </footer>
  );
}
