const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Terms & Conditions
      </h1>

      <p className="text-gray-600 mb-4">
        By registering for and participating in HackBits, you agree to comply
        with the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Eligibility</h2>
      <p className="text-gray-600 mb-4">
        Participants must be students or individuals invited by the organizing
        team. Teams may consist of 1–5 members.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Code of Conduct</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Respect all participants, mentors, and volunteers.</li>
        <li>No harassment or discriminatory behavior is tolerated.</li>
        <li>Follow university rules and venue policies.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Project Rules</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>All work must be created during the event timeframe.</li>
        <li>Open-source libraries and APIs are permitted.</li>
        <li>No plagiarism or pre-built projects allowed.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Disqualification</h2>
      <p className="text-gray-600 mb-4">
        HackBits reserves the right to disqualify any team for unethical
        behavior, rule violations, or misconduct.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Liability</h2>
      <p className="text-gray-600 mb-4">
        Participants are responsible for their own equipment and belongings.
        HackBits is not liable for personal loss or damages.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Contact</h2>
      <p className="text-gray-600">
        For questions regarding these terms, contact:  
        <span className="text-primary-600 font-medium ml-1">
          hackbitsofficialteam@gmail.com
        </span>
      </p>
    </div>
  );
};

export default TermsAndConditions;
