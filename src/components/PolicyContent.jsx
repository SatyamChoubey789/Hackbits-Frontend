// PolicyContent.jsx

import './PolicyContent.css';
const PolicyContent = () => {
    return (
        <div className="policy-content-container">
            <section className="policy-section">
                <h2>Privacy Policy</h2>
                <p>
                    We are committed to protecting your privacy. We collect only the necessary information to provide our services and do not share your data with third parties without your consent.
                </p>
            </section>

            <section className="policy-section">
                <h2>Terms of Service</h2>
                <p>
                    By using our services, you agree to comply with our terms and conditions. We reserve the right to modify these terms at any time, and it is your responsibility to stay informed of any changes.
                </p>
            </section>
            <section className="policy-section">
                <h2>Code of Conduct</h2>
                <p>
                    We expect all participants to adhere to our code of conduct, which promotes a respectful and inclusive environment. Harassment or discrimination of any kind will not be tolerated.
                </p>
            </section>
        </div>
    );
}