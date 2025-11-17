// write policypage for our hackathon


import PolicyContent from '../components/PolicyContent';
import Navbar from '../components/Navbar';


const PolicyPage = () => {
    return (
        <div className="policy-page">
            <Navbar />
            <main className="policy-content">
                <h1>Our Policies</h1>
                <PolicyContent />
            </main>
        </div>
    );
}