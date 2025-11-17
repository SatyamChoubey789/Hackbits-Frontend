

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        At HackBits, we are committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, and safeguard your data
        when you participate in our event or use our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Information We Collect</h2>
      <p className="text-gray-600 mb-4">
        We collect personal details such as your name, email, phone number,
        university details, and team information. This helps us manage
        registrations and ensure smooth communication.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">How We Use Your Data</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>To manage event registrations and team details</li>
        <li>To send event updates, schedules, and important announcements</li>
        <li>To verify participant identity during check-in</li>
        <li>To ensure a secure and fair event experience</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Data Protection</h2>
      <p className="text-gray-600 mb-4">
        We do not share or sell your information. All data is stored securely
        and used strictly for the purpose of organizing HackBits.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p className="text-gray-600">
        Have questions about your data privacy?  
        Email us at:  
        <span className="text-primary-600 font-medium ml-1">
          hackbitsofficialteam@gmail.com
        </span>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
