export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">MS Academy</h3>
            <p className="mt-2 text-sm text-gray-600">Outcome-focused courses and mentorship.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Explore</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><a href="#courses" className="hover:text-gray-900">Courses</a></li>
              <li><a href="#instructors" className="hover:text-gray-900">Instructors</a></li>
              <li><a href="#about" className="hover:text-gray-900">About</a></li>
              <li><a href="#feedback" className="hover:text-gray-900">Feedback</a></li>
              <li><a href="#contact" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Terms</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>Email: support@msacademy.com</li>
              <li>Phone: +880-1234-567890</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} MS Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}