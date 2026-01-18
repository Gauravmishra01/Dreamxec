export default function Payments() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. PAYMENT, FUNDING & FINANCIAL TERMS</h2>

            <h3 className="font-bold">4.1 Funding Mechanics</h3>

            <p className="font-bold">a) Contribution Process</p>

            <p>Step 1: Backer selects project and pledge amount</p>
            <p>Step 2: DreamXec verifies project compliance</p>
            <p>Step 3: Backer provides payment information</p>
            <p>Step 4: Payment processed securely</p>
            <p>Step 5: Funds held in escrow until milestone completion</p>
            <p>Step 6: Funds released to Innovator upon milestone verification</p>
            <p>Step 7: Backer receives updates and impact reports</p>

            <p className="font-bold">b) Payment Methods Accepted</p>
            <ul className="list-disc pl-6">
                <li>Credit/debit cards (Visa, Mastercard, Rupay)</li>
                <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
                <li>Net banking (all major Indian banks)</li>
                <li>Digital wallets (if permitted by regulations)</li>
                <li>Not accepted: Cash, cryptocurrency, checks</li>
            </ul>

            <p className="font-bold">c) Payment Processing</p>
            <ul className="list-disc pl-6">
                <li>All payments processed via PCI-DSS compliant gateway</li>
                <li>[PROCESSOR NAME - e.g., Razorpay, Instamojo]</li>
                <li>Payment terms: Real-time processing</li>
                <li>Currency: INR only (for now)</li>
            </ul>

            <h3 className="font-bold">4.2 Fees & Charges</h3>

            <p className="font-bold">Platform Fees:</p>

            <p className="font-bold">EDUCATOR TIER (&lt; ₹5 Lakhs projects):</p>
            <ul className="list-disc pl-6">
                <li>8% platform fee from successful projects</li>
                <li>No upfront project posting fees</li>
            </ul>

            <p className="font-bold">RESEARCH TIER (₹5-25 Lakhs projects):</p>
            <ul className="list-disc pl-6">
                <li>7% platform fee from successful projects</li>
                <li>₹500 project review fee (non-refundable)</li>
                <li>₹1,000/month project featuring (optional)</li>
            </ul>

            <p className="font-bold">SCALE TIER (&gt; ₹25 Lakhs projects):</p>
            <ul className="list-disc pl-6">
                <li>6% platform fee from successful projects</li>
                <li>₹2,000 project review fee</li>
                <li>Custom mentorship package (₹5,000-20,000)</li>
                <li>[Negotiable terms]</li>
            </ul>

            <p className="font-bold">PAYMENT PROCESSOR FEES:</p>
            <ul className="list-disc pl-6">
                <li>2.36% + ₹3 (for card payments)</li>
                <li>2% (for UPI payments)</li>
                <li>Borne by platform (not charged to backers)</li>
            </ul>

            <p className="font-bold">BACKER SIDE FEES:</p>
            <ul className="list-disc pl-6">
                <li>None (platform absorbs processor fees)</li>
                <li>Backer pays only stated pledge amount</li>
            </ul>

            <p className="font-bold">Example:</p>

            <p>Backer pledges ₹1,000 to a project</p>
            <p>Backer is charged: ₹1,000 (no additional fee)</p>

            <p>Project raised ₹10 Lakhs via 1,000 backers</p>
            <p>Platform fee: ₹70,000 (7%)</p>
            <p>Processor fee: ₹23,600 (2.36% + ₹3)</p>
            <p>Innovator receives: ₹9,06,400</p>

            <p>(Numbers in example only - actual rates subject to regulatory approval)</p>

            <h3 className="font-bold">4.3 Escrow & Fund Management</h3>

            <p className="font-bold">a) Escrow Mechanism</p>
            <ul className="list-disc pl-6">
                <li>Funds held in trust with [ESCROW PROVIDER - e.g., bank, NBFC]</li>
                <li>Funds NOT used by DreamXec for operations</li>
                <li>Interest earned goes to platform (capped at bank rate)</li>
                <li>Regular audits by [AUDITOR]</li>
            </ul>

            <p className="font-bold">b) Fund Release Timeline</p>

            <p>Project reaches 100% of goal</p>
            <p>↓ (Day 1)</p>
            <p>Immediate release to DreamXec's account</p>
            <p>↓ (Day 1-2)</p>
            <p>DreamXec verification of milestones</p>
            <p>↓ (Day 3-5)</p>
            <p>Transfer to Innovator's verified bank account</p>
            <p>↓ (Day 5-7)</p>
            <p>Funds appear in Innovator's account</p>

            <p className="font-bold">c) Failed/Cancelled Projects</p>
            <ul className="list-disc pl-6">
                <li>If project fails to reach goal: Full refund to backers (within 10 days)</li>
                <li>If project cancelled mid-campaign: Full refund (within 10 days)</li>
                <li>If Innovator fails milestones: See section 5 (Refunds)</li>
            </ul>

            <h3 className="font-bold">4.4 Payment Security</h3>

            <p className="font-bold">PCI-DSS Compliance:</p>
            <ul className="list-disc pl-6">
                <li>Payment card information not stored on DreamXec servers</li>
                <li>Only [PROCESSOR] stores encrypted payment details</li>
                <li>SSL/TLS encryption for all transactions</li>
                <li>Two-factor authentication for large transactions</li>
                <li>Tokenization for recurring payments</li>
            </ul>

            <p className="font-bold">Your Payment Information:</p>
            <ul className="list-disc pl-6">
                <li>Never shared with Innovators</li>
                <li>Never used for secondary purposes</li>
                <li>Deleted after transaction (30-90 days retention for reconciliation)</li>
                <li>Subject to Privacy Policy (Section 6)</li>
            </ul>

            <h3 className="font-bold">4.5 Tax & Compliance</h3>

            <p className="font-bold">GST Compliance:</p>
            <ul className="list-disc pl-6">
                <li>Platform fees: 18% GST applicable (added to invoice)</li>
                <li>Innovators: Responsible for filing GST returns if applicable</li>
                <li>Backers: No GST on donations (charitable classification pending)</li>
            </ul>

            <p className="font-bold">Income Tax:</p>
            <ul className="list-disc pl-6">
                <li>Classification: [DONATION / INVESTMENT / OTHER]</li>
                <li>Backer reporting: No 1099/TDS if below ₹5 Lakh/year</li>
                <li>Innovator reporting: Required above ₹5 Lakh/year</li>
                <li>Both parties responsible for own tax compliance</li>
            </ul>

            <p className="font-bold">Example Tax Treatment:</p>

            <p className="font-bold">Backer scenario:</p>
            <p>- Pledges ₹1,000 → Not tax-deductible (for now)</p>
            <p>- Only deductible if DreamXec gets 80G status</p>

            <p className="font-bold">Innovator scenario:</p>
            <p>- Receives ₹10 Lakhs → Must declare as income</p>
            <p>- File ITR if total income &gt; applicable threshold</p>
            <p>- May be deductible if research is registered</p>
            <h2 className="text-2xl font-bold">5. REFUNDS & DISPUTE RESOLUTION</h2>

            <h3 className="font-bold">5.1 Refund Policy</h3>

            <p className="font-bold">a) Automatic Refunds (No Questions Asked)</p>

            <table className="w-full border border-gray-300 text-sm">
                <thead>
                    <tr>
                        <th className="border p-2">Scenario</th>
                        <th className="border p-2">Timeline</th>
                        <th className="border p-2">Backer Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">Project failed to reach goal</td>
                        <td className="border p-2">Immediately</td>
                        <td className="border p-2">None (automatic)</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Project cancelled by Innovator</td>
                        <td className="border p-2">Immediately</td>
                        <td className="border p-2">None (automatic)</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Duplicate payment/overcharge</td>
                        <td className="border p-2">Within 5 days</td>
                        <td className="border p-2">Report through app</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Payment processed twice</td>
                        <td className="border p-2">Within 5 days</td>
                        <td className="border p-2">Report through app</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Card declined but charged</td>
                        <td className="border p-2">Within 5 days</td>
                        <td className="border p-2">Report through app</td>
                    </tr>
                </tbody>
            </table>

            <p className="font-bold">b) Conditional Refunds (Request Required)</p>

            <table className="w-full border border-gray-300 text-sm">
                <thead>
                    <tr>
                        <th className="border p-2">Scenario</th>
                        <th className="border p-2">Condition</th>
                        <th className="border p-2">Backer Action</th>
                        <th className="border p-2">Timeline</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">Innovator failed milestone</td>
                        <td className="border p-2">Must provide evidence</td>
                        <td className="border p-2">Submit dispute</td>
                        <td className="border p-2">30 days</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Project stalled (no update &gt;90 days)</td>
                        <td className="border p-2">Must have no recent updates</td>
                        <td className="border p-2">Report inactivity</td>
                        <td className="border p-2">14 days investigation</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Misrepresented project details</td>
                        <td className="border p-2">Must show misrepresentation</td>
                        <td className="border p-2">Submit formal complaint</td>
                        <td className="border p-2">30 days investigation</td>
                    </tr>
                    <tr>
                        <td className="border p-2">Funds misused (not per project plan)</td>
                        <td className="border p-2">Must provide evidence</td>
                        <td className="border p-2">Report to support</td>
                        <td className="border p-2">60 days investigation</td>
                    </tr>
                </tbody>
            </table>

            <p className="font-bold">c) Non-Refundable Scenarios</p>
            <ul className="list-disc pl-6">
                <li>Regular pledges are non-refundable once project work begins</li>
                <li>Exception: Refund if Innovator abandons project (no updates &gt;180 days)</li>
                <li>Exception: Refund if Project proves fraudulent</li>
                <li>No refunds for change of mind after project launches</li>
            </ul>

            <h3 className="font-bold">5.2 Dispute Resolution Process</h3>

            <p>Step 1: Self-Help (5 days)</p>
            <ul className="list-disc pl-6">
                <li>Contact Innovator via Platform messaging</li>
                <li>Attempt to resolve directly</li>
                <li>Provide evidence of concern</li>
            </ul>

            <p>Step 2: Platform Mediation (14 days)</p>
            <ul className="list-disc pl-6">
                <li>File dispute through Platform</li>
                <li>Submit evidence (screenshots, emails, research)</li>
                <li>DreamXec reviews both parties</li>
                <li>DreamXec proposes resolution</li>
            </ul>

            <p>Step 3: Independent Arbitration (60 days)</p>
            <ul className="list-disc pl-6">
                <li>If unresolved after mediation</li>
                <li>Proceed to independent arbitrator</li>
                <li>Costs split 50-50 if Backer wins, 100% by Backer if loses</li>
            </ul>

            <p>Step 4: Legal Action</p>
            <ul className="list-disc pl-6">
                <li>If arbitration fails</li>
                <li>Either party may sue in courts of Delhi/Gurgaon</li>
                <li>Loser pays court costs</li>
            </ul>

            <p className="font-bold">Dispute Timeline:</p>
            <ul className="list-disc pl-6">
                <li>Day 1: Issue occurs</li>
                <li>Day 1–5: Direct communication attempt</li>
                <li>Day 6–19: Platform mediation</li>
                <li>Day 20–79: Arbitration</li>
                <li>Day 80+: Legal proceedings (if necessary)</li>
            </ul>

            <h3 className="font-bold">5.3 Arbitration Terms</h3>

            <p className="font-bold">Arbitration Agreement:</p>
            <ul className="list-disc pl-6">
                <li>All disputes must go to arbitration first</li>
                <li>Single arbitrator (unless claim &gt;₹50 Lakh)</li>
                <li>Arbitration conducted per Indian Arbitration Act</li>
                <li>Venue: Delhi/Gurgaon</li>
                <li>Language: English/Hindi</li>
                <li>Rules: [ARBITRATION BODY - e.g., ICCR, ICMR]</li>
            </ul>

            <p className="font-bold">Exceptions to Arbitration:</p>
            <ul className="list-disc pl-6">
                <li>Injunctive relief (emergency court order)</li>
                <li>IP infringement claims</li>
                <li>Platform trademark/brand protection</li>
                <li>Regulatory investigations</li>
            </ul>
        </div>
    );
}
