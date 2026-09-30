# Can MedMethod Direct Operate a HIPAA-Compliant Patient Portal Inside Manus?

**Assessment date:** September 29, 2026  
**Prepared by:** Manus AI

## Decision

**No—not under Manus’s currently published policies and the present MedMethod Direct hosting configuration.**

A patient portal could be **designed and prototyped** in Manus using fictional or de-identified data. The public website can also link to or visually integrate with a portal. However, a production portal that stores or transmits patient messages, diagnoses, treatment details, prescriptions, appointments, documents, or other electronic protected health information (ePHI) should **not** use Manus-hosted authentication, databases, file storage, logs, AI processing, or runtime services unless Manus first provides a written HIPAA Business Associate Agreement (BAA) that expressly covers every service involved.

The strongest reason is contractual, not merely technical. Manus’s current Data Processing Addendum defines HIPAA-protected health information and medical information as **Sensitive Data**, then states:

> “Customer shall not provide or otherwise make available to Butterfly Effect any Sensitive Data.” [1]

The same DPA also says the categories of Sensitive Data submitted to the service must be **none**, and that the customer is liable for Sensitive Data it submits. Because patient-portal messages and records would normally contain PHI, that provision is a direct blocker.

## What the official Manus materials establish

### 1. Manus’s DPA currently prohibits submitting PHI

The DPA expressly includes the following within its definition of Sensitive Data:

- Protected health information subject to HIPAA
- Health-insurance information
- Medical history
- Physical or mental conditions
- Medical treatment or diagnosis
- Other identifiable health data

It then prohibits customers from providing Sensitive Data to Manus. This means general statements elsewhere saying Manus can process voluntarily supplied “Health Data” do **not** create permission to operate a HIPAA patient portal. The stricter contractual restriction in the DPA controls this assessment. [1] [2]

### 2. No public HIPAA BAA or HIPAA certification was found

Manus’s Trust Center lists **SOC 2 Type II, ISO 27001, and ISO 27701**. Those are meaningful security and privacy credentials, but none substitutes for a HIPAA BAA. The public Trust Center resource list does not show a HIPAA BAA, HIPAA attestation, or HITRUST certification. [3] [4]

HHS states that a cloud provider that creates, receives, maintains, or transmits ePHI is a HIPAA business associate—even if the provider only stores encrypted data and cannot decrypt it. The covered healthcare organization must have a HIPAA-compliant BAA with that provider. [5]

### 3. Manus itself describes its healthcare sites as “HIPAA-aware,” not HIPAA-hosted clinical systems

Manus’s official dental website guidance says it can build a “HIPAA-aware front-end” and route sensitive intake information to an existing practice-management system or secure service. It separately advises that clinical workflows storing PHI require a BAA with the hosting or form provider. That description supports using Manus as the public presentation layer, not as the PHI system of record under the current terms. [6]

### 4. General security controls are present, but they do not resolve the contractual issue

Manus publicly reports encryption in transit and at rest, restricted production access, penetration testing, vulnerability monitoring, business-continuity procedures, incident response, and data-retention controls. These are useful foundations. [3] [4]

They do not, by themselves, establish HIPAA compliance for MedMethod Direct. HIPAA also requires a covered service arrangement, assigned responsibilities, risk analysis, access controls, audit controls, authentication, integrity protections, transmission security, contingency planning, workforce policies, and ongoing evaluation. [7]

### 5. The data and subprocessor chain is not currently verified for ePHI

Manus lists Google Cloud Platform, Microsoft Azure AI Foundry, AWS, Cloudflare, Intercom, OpenAI, Stripe, RevenueCat, and Twilio as subprocessors. Its Trust Center says data may be stored in the United States or Singapore. [8] [9]

The public materials reviewed do not establish that each service which could touch portal ePHI is included in a Manus BAA chain or restricted to HIPAA-eligible configurations. A compliant deployment would need written confirmation of the exact service boundary, not assumptions based on the underlying cloud brands.

## Stress test of the current MedMethod Direct application

The current website is a marketing and payment application, not a HIPAA patient-portal baseline. A source review identified the following blockers if an authenticated portal were simply added to this same application:

### Global third-party tracking

The shared document currently loads Google Tag Manager, GoHighLevel affiliate tracking, and site analytics. The React bootstrap also installs Meta Pixel behavior based on the current route. A portal route added to this same shell could therefore expose authenticated-page activity or identifiers to tracking vendors unless the portal were rigorously isolated.

HHS states that tracking technologies on authenticated patient-portal pages generally have access to PHI. Vendors receiving that information become business associates in relevant circumstances, requiring permitted disclosures and BAAs. Login and registration pages can also create PHI disclosures when tracking scripts collect credentials or registration information. [10]

**Result:** The current shared application shell fails the portal tracking-isolation test.

### Authentication and authorization

The current built-in user model has broad `user` and `admin` roles and relies on Manus OAuth. A clinical portal would need verified patient identity, separate patient/physician/staff roles, least-privilege authorization, workforce access management, strong session controls, and preferably mandatory MFA for clinical staff. The current application does not demonstrate that complete control set.

**Result:** The current application fails the clinical role and identity test.

### Auditability

HIPAA requires mechanisms to record and examine activity in systems containing ePHI. The current application has operational payment and email logs, but no immutable clinical audit trail covering record views, message access, downloads, exports, edits, administrative access, impersonation, or disclosure history. [7]

**Result:** The current application fails the clinical audit-control test.

### Data minimization and logging

The current database already stores patient contact and payment-related information. One webhook log table is designed to store a full outbound GoHighLevel request payload and response details. That pattern would be inappropriate for clinical messaging unless redesigned so application logs, error logs, support systems, and webhook records cannot capture unnecessary ePHI.

**Result:** The current logging design is unsuitable for portal PHI without substantial separation and redesign.

### AI and support exposure

Manus’s Privacy Policy states that inputs may be sent to third-party AI providers when needed to fulfill requests and that task files, command output, execution logs, conversations, object storage, or memory may retain information depending on the feature used. Manus’s terms also state that the service is not a permanent archive or substitute for maintaining health records. [2] [11]

**Result:** Real patient data should not be entered into Manus tasks, prompts, support conversations, browser sessions, or development logs.

## Architecture that passes this review

The recommended structure is:

1. Keep `medmethoddirect.com` as the public marketing website.
2. Create a separate portal origin, such as `portal.medmethoddirect.com`.
3. Host the portal runtime, authentication, database, file storage, backups, logs, messaging, and notification service entirely within a HIPAA-eligible environment covered by signed BAAs.
4. Use an existing HIPAA-ready EHR or patient portal when possible. If a custom portal is required, deploy exported application code to a properly configured AWS, Azure, or Google Cloud account covered by MedMethod Direct’s BAA.
5. Do not use the current Manus database, Manus OAuth, Manus file storage, Manus runtime logs, Manus AI features, or Manus-hosted backend for production PHI unless Manus provides a written BAA and explicitly includes those products.
6. Do not load Meta Pixel, GTM advertising tags, GoHighLevel affiliate tracking, session-replay software, or ordinary marketing analytics on portal, login, registration, messaging, appointment, document, or payment pages that can expose PHI.
7. Keep notifications content-neutral. For example: “You have a new secure message. Sign in to your portal.” Do not place diagnoses, medication names, or treatment details in ordinary email or SMS.
8. Complete a formal HIPAA risk analysis and have healthcare privacy/security counsel review the architecture, vendor contracts, policies, and workflows before launch.

Manus may still be used to create the interface and application code with synthetic test data. The code can then be exported and deployed to the compliant environment. Once real PHI is introduced, development, testing, support, analytics, and incident-response workflows must also stay inside the approved boundary.

## What would have to change for an all-Manus portal to become acceptable

Do not proceed unless Manus provides all of the following **in writing**:

- A signed HIPAA BAA with MedMethod Direct
- Explicit confirmation that WebDev/Spaces hosting is in scope
- Explicit confirmation that the production database, authentication, file storage, backups, logs, CDN/network layer, support access, and incident-response processes are in scope
- A list of subprocessors that could receive ePHI and confirmation that downstream BAA obligations are satisfied
- Defined data residency and retention terms for ePHI
- HIPAA breach-notification commitments
- Audit-log, backup, recovery, deletion, export, and termination procedures
- Confirmation that ePHI will not be used for model training, service improvement, advertising, or unrelated analytics
- A supported method to disable all tracking and AI processing within the portal boundary
- Documentation sufficient for MedMethod Direct’s own HIPAA risk analysis

A normal DPA, SOC 2 report, encryption statement, or vendor claim that a product is “HIPAA-aware” is not enough.

## Final recommendation

**Do not build the production PHI portal inside the current Manus-hosted MedMethod Direct application.** Build the prototype here with synthetic data, then deploy it behind a separate portal domain in a BAA-backed clinical environment—or use the secure messaging capabilities of the existing MD-HQ portal if they meet the practice’s needs.

If MedMethod Direct wants to explore a special enterprise arrangement, send the checklist above to [Manus Support](https://help.manus.im). Unless Manus returns a signed BAA and confirms the exact services in scope, treat the answer as **no PHI in Manus**.

This assessment is a technical and policy review, not legal advice or a formal HIPAA certification.

## References

[1]: https://manus.im/policies/data-processing-addendum "Manus Data Processing Addendum"
[2]: https://manus.im/privacy "Manus Privacy Policy"
[3]: https://trust.manus.im/ "Manus Trust Center"
[4]: https://trust.manus.im/resources "Manus Trust Center Resources"
[5]: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html "HHS Guidance on HIPAA and Cloud Computing"
[6]: https://manus.im/playbook/dental-website-builder "Manus AI Dental Website Builder Guidance"
[7]: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html "HHS Summary of the HIPAA Security Rule"
[8]: https://trust.manus.im/subprocessors "Manus Subprocessor List"
[9]: https://trust.manus.im/faq "Manus Trust Center FAQ"
[10]: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html "HHS Guidance on Online Tracking Technologies"
[11]: https://manus.im/terms "Manus Terms of Service"
