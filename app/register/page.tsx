import Link from "next/link";
import { signUp } from "../login/actions";

export const metadata = {
  title: "Register your agency",
  description: "Create an Agency Privé owner account and begin building your agency profile.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const selectedPlan = ["free", "prive", "select", "elite"].includes(params.plan ?? "") ? params.plan : "free";

  return <div className="access-page registration-access-page">
    <a className="access-skip" href="#registration-form">Skip to registration form</a>
    <aside className="access-brand registration-access-brand" aria-label="Agency Privé registration benefits">
      <div className="access-brand-inner">
        <Link className="access-logo" href="/" aria-label="Agency Privé homepage">
          <span className="access-monogram" aria-hidden="true">AP<i>✦</i></span>
          <span><strong>AGENCY PRIVÉ</strong><small>THE GLOBAL AGENCY DIRECTORY</small></span>
        </Link>
        <div className="access-message registration-message">
          <p className="access-kicker">FOR CREATOR-MANAGEMENT AGENCIES</p>
          <h1>Start free.<br />Grow with<br /><em>Privé.</em></h1>
          <p>Create the owner account for your agency. After confirming your email, you can build a private profile, invite team members, and submit it for moderation.</p>
          <div className="registration-benefits">
            <div><span>01</span><p><b>Create owner access</b><small>Secure account and private workspace</small></p></div>
            <div><span>02</span><p><b>Build your profile</b><small>Services, expertise, location, and company story</small></p></div>
            <div><span>03</span><p><b>Submit for review</b><small>Moderation, verification, and publication remain separate</small></p></div>
          </div>
        </div>
        <div className="access-role-list"><span>FREE PROFILE</span><i aria-hidden="true" /><span>NO CARD REQUIRED</span><i aria-hidden="true" /><span>INDEPENDENT REVIEW</span></div>
      </div>
    </aside>
    <main className="access-main registration-main">
      <div className="access-form-wrap">
        <Link className="access-back" href="/">← &nbsp; RETURN TO HOMEPAGE</Link>
        <div className="access-heading">
          <p>AGENCY OWNER REGISTRATION</p><h2>Create your account.</h2>
          <span>This form creates the first owner account. Employees are added later through controlled invitations.</span>
        </div>
        <form id="registration-form" className="access-form registration-form" action={signUp}>
          {params.error && <p className="access-alert error" role="alert">{params.error}</p>}
          <input type="hidden" name="next" value="/agency/dashboard" />
          <div className="registration-grid">
            <label><span>FIRST NAME</span><input name="firstName" type="text" placeholder="First name" autoComplete="given-name" required /></label>
            <label><span>LAST NAME</span><input name="lastName" type="text" placeholder="Last name" autoComplete="family-name" required /></label>
          </div>
          <label><span>AGENCY OR COMPANY NAME</span><input name="agencyName" type="text" placeholder="Your agency name" autoComplete="organization" required /></label>
          <label><span>SELECTED PLAN</span><select name="plan" defaultValue={selectedPlan} required><option value="free">Free — $0 forever</option><option value="prive">Privé — $49/month</option><option value="select">Privé Select — $129/month</option><option value="elite">Privé Elite — $299/month</option></select><small>No payment is collected during registration.</small></label>
          <label><span>OWNER EMAIL ADDRESS</span><input name="email" type="email" placeholder="owner@company.com" autoComplete="email" required /></label>
          <label><span>CREATE PASSWORD</span><input name="password" type="password" placeholder="Minimum of 8 characters" minLength={8} autoComplete="new-password" required /></label>
          <label className="registration-consent"><input name="authorized" type="checkbox" required /><span>I confirm that I am authorized to create and manage this agency profile.</span></label>
          <button className="access-submit" type="submit">CREATE OWNER ACCOUNT <span>→</span></button>
        </form>
        <div className="access-switch"><p>Already registered? <Link href="/agency/login">Sign in securely</Link></p><small>Creating an account does not automatically publish or verify an agency.</small></div>
      </div>
    </main>
  </div>;
}
