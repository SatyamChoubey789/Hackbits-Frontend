

export const PolicyContent = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-3">Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                    We are committed to protecting your privacy. We collect only the necessary 
                    information to provide our services and do not share your data with third parties 
                    without your consent.
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-3">Terms of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                    By using our services, you agree to comply with our terms and conditions. 
                    We reserve the right to modify these terms at any time, and it is your 
                    responsibility to stay informed of any changes.
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-3">Code of Conduct</h2>
                <p className="text-gray-700 leading-relaxed">
                    We expect all participants to adhere to our code of conduct, which promotes 
                    a respectful and inclusive environment. Harassment or discrimination of any kind 
                    will not be tolerated.
                </p>
            </section>
        </div>
    );
}

