export default function AcceptableUse() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">3. USER RESPONSIBILITIES & ACCEPTABLE USE POLICY</h2>

      <h3 className="font-bold">3.1 Your Responsibilities as a User</h3>

      <p>You agree to:</p>

      <p className="font-bold">a) Accuracy & Honesty</p>
      <ul className="list-disc pl-6">
        <li>Post truthful, accurate project descriptions</li>
        <li>Disclose conflicts of interest</li>
        <li>Not misrepresent your credentials or affiliations</li>
        <li>Correct information if it becomes inaccurate</li>
      </ul>

      <p className="font-bold">b) Legality Compliance</p>
      <ul className="list-disc pl-6">
        <li>Not use Platform for illegal activities</li>
        <li>Comply with all applicable laws</li>
        <li>Not facilitate money laundering or terrorism financing</li>
        <li>Not evade sanctions or export controls</li>
      </ul>

      <p className="font-bold">c) Respect Others' Rights</p>
      <ul className="list-disc pl-6">
        <li>Not infringe third-party IP rights</li>
        <li>Not defame, harass, or discriminate</li>
        <li>Not doxx or reveal others' personal information</li>
        <li>Not engage in cyberbullying or threats</li>
      </ul>

      <p className="font-bold">d) Platform Security</p>
      <ul className="list-disc pl-6">
        <li>Not attempt to hack or breach security</li>
        <li>Not create multiple accounts to circumvent limits</li>
        <li>Not use bots or automated tools (except with permission)</li>
        <li>Not access others' accounts or data</li>
      </ul>

      <h3 className="font-bold">3.2 Prohibited Content & Activities</h3>

      <p>You CANNOT post:</p>

      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Prohibited Activity</th>
            <th className="p-2 text-left">Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Illegal</td>
            <td className="p-2">Activities violating law</td>
            <td className="p-2">Drug manufacturing, weapons, explosives, unlicensed gambling</td>
          </tr>
          <tr>
            <td className="p-2">Harmful</td>
            <td className="p-2">Content endangering safety</td>
            <td className="p-2">Dangerous DIY, bio-hazards, violence instructions</td>
          </tr>
          <tr>
            <td className="p-2">Fraudulent</td>
            <td className="p-2">Deceptive/misleading content</td>
            <td className="p-2">Fake credentials, false funding needs, scam projects</td>
          </tr>
          <tr>
            <td className="p-2">IP Violation</td>
            <td className="p-2">Infringing IP rights</td>
            <td className="p-2">Plagiarized research, unauthorized copyrighted material</td>
          </tr>
          <tr>
            <td className="p-2">Harassment</td>
            <td className="p-2">Abusive/threatening content</td>
            <td className="p-2">Hate speech, doxxing, blackmail</td>
          </tr>
          <tr>
            <td className="p-2">Sexual</td>
            <td className="p-2">Explicit/exploitative content</td>
            <td className="p-2">CSAM, non-consensual intimate images</td>
          </tr>
          <tr>
            <td className="p-2">Spam</td>
            <td className="p-2">Unwanted mass communications</td>
            <td className="p-2">Commercial spam, chain letters</td>
          </tr>
          <tr>
            <td className="p-2">Misinformation</td>
            <td className="p-2">False/misleading information</td>
            <td className="p-2">Health misinformation, election manipulation</td>
          </tr>
          <tr>
            <td className="p-2">Regulated</td>
            <td className="p-2">Activities requiring licenses</td>
            <td className="p-2">Unlicensed financial or medical advice</td>
          </tr>
        </tbody>
      </table>

      <p className="font-bold mt-4">Consequences of Prohibited Content:</p>
      <ul className="list-disc pl-6">
        <li>Immediate content removal</li>
        <li>Account suspension (3-30 days)</li>
        <li>Account termination</li>
        <li>Referral to law enforcement (if applicable)</li>
        <li>Civil/criminal liability</li>
      </ul>

      <h3 className="font-bold">3.3 Project Guidelines</h3>

      <p className="font-bold">Projects Must:</p>
      <ul className="list-disc pl-6">
        <li>Have clear, realistic funding goals</li>
        <li>Describe methodology transparently</li>
        <li>Include timeline for milestones</li>
        <li>Define success metrics</li>
        <li>Be consistent with DreamXec's mission (college research)</li>
        <li>Not duplicate another active project</li>
        <li>Be for legitimate research purposes</li>
        <li>Include advisor/institutional endorsement</li>
      </ul>

      <p className="font-bold">Projects Cannot:</p>
      <ul className="list-disc pl-6">
        <li>Seek funds for personal expenses (tuition, living costs)</li>
        <li>Be for commercial products (unless research-focused)</li>
        <li>Involve human subjects without ethics approval</li>
        <li>Use animals without animal care approval</li>
        <li>Contain fake testimonials or reviews</li>
        <li>Misrepresent funding use</li>
        <li>Be pyramid schemes or MLMs</li>
      </ul>
    </div>
  );
}
