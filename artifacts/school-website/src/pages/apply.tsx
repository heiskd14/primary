import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitAdmission } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

const CLASSES = [
  "Creche (6 weeks – 18 months)",
  "Toddler (18 months – 2 years)",
  "Nursery 1 (Age 3)",
  "Nursery 2 (Age 4)",
  "Kindergarten (Age 5)",
  "Primary 1 (Age 6)",
  "Primary 2 (Age 7)",
  "Primary 3 (Age 8)",
  "Primary 4 (Age 9)",
  "Primary 5 (Age 10)",
  "Primary 6 (Age 11)",
  "JSS 1",
  "JSS 2",
  "JSS 3",
];

type FormData = {
  childFirstName: string;
  childLastName: string;
  childDob: string;
  childGender: string;
  classApplyingFor: string;
  previousSchool: string;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentPhone2: string;
  parentEmail: string;
  parentAddress: string;
  howDidYouHear: string;
  additionalInfo: string;
};

const EMPTY: FormData = {
  childFirstName: "", childLastName: "", childDob: "", childGender: "",
  classApplyingFor: "", previousSchool: "",
  parentName: "", parentRelationship: "", parentPhone: "", parentPhone2: "",
  parentEmail: "", parentAddress: "", howDidYouHear: "", additionalInfo: "",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", onFocus, onBlur }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  onFocus?: React.FocusEventHandler; onBlur?: React.FocusEventHandler;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
      onFocus={e => { e.currentTarget.style.borderColor = NAVY; onFocus?.(e); }}
      onBlur={e => { e.currentTarget.style.borderColor = ""; onBlur?.(e); }}
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors bg-white"
      onFocus={e => (e.currentTarget.style.borderColor = NAVY)}
      onBlur={e => (e.currentTarget.style.borderColor = "")}
    >
      {children}
    </select>
  );
}

const steps = ["Child Details", "Parent / Guardian", "Additional Info", "Review & Submit"];

export default function Apply() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useSubmitAdmission();

  const set = (field: keyof FormData) => (v: string) => setForm(f => ({ ...f, [field]: v }));

  function validateStep(s: number) {
    const e: typeof errors = {};
    if (s === 0) {
      if (!form.childFirstName.trim()) e.childFirstName = "Required";
      if (!form.childLastName.trim()) e.childLastName = "Required";
      if (!form.childDob) e.childDob = "Required";
      if (!form.childGender) e.childGender = "Required";
      if (!form.classApplyingFor) e.classApplyingFor = "Required";
    }
    if (s === 1) {
      if (!form.parentName.trim()) e.parentName = "Required";
      if (!form.parentRelationship) e.parentRelationship = "Required";
      if (!form.parentPhone.trim()) e.parentPhone = "Required";
      if (!form.parentEmail.trim()) e.parentEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) e.parentEmail = "Enter a valid email address";
      if (!form.parentAddress.trim()) e.parentAddress = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep(s => s + 1);
  }
  function back() { setStep(s => s - 1); setErrors({}); }

  async function submit() {
    try {
      await mutation.mutateAsync({
        data: {
          childFirstName: form.childFirstName,
          childLastName: form.childLastName,
          childDob: form.childDob,
          childGender: form.childGender,
          classApplyingFor: form.classApplyingFor,
          previousSchool: form.previousSchool || undefined,
          parentName: form.parentName,
          parentRelationship: form.parentRelationship,
          parentPhone: form.parentPhone,
          parentPhone2: form.parentPhone2 || undefined,
          parentEmail: form.parentEmail || undefined,
          parentAddress: form.parentAddress,
          howDidYouHear: form.howDidYouHear || undefined,
          additionalInfo: form.additionalInfo || undefined,
        },
      });
      setSuccess(true);
    } catch {
      // error handled below
    }
  }

  const inputClass = (field: keyof FormData) =>
    errors[field] ? "border-red-400" : "";

  if (success) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-lg">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#f0f4ff" }}>
              <CheckCircle className="w-10 h-10" style={{ color: NAVY }} />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>Application Submitted!</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Thank you for applying to <strong>Triple Tee Montessori Academy</strong>. Your application for <strong>{form.childFirstName} {form.childLastName}</strong> has been received.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our admissions team will be in touch shortly. If you have any questions in the meantime, please call us on <strong>07036500419</strong> or <strong>08032348460</strong>.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/" className="px-5 py-2.5 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: NAVY }}>
                Back to Home
              </Link>
              <button onClick={() => { setForm(EMPTY); setStep(0); setSuccess(false); }}
                className="px-5 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                Submit Another
              </button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title="Online Admission Application"
        subtitle="Complete the form below to apply for a place at Triple Tee Montessori Academy"
        breadcrumb="Home / Admissions / Apply Online"
      />

      <section className="max-w-3xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                  style={{
                    backgroundColor: i < step ? "#16a34a" : i === step ? NAVY : "#e5e7eb",
                    color: i <= step ? "white" : "#6b7280",
                  }}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className="text-xs font-medium mt-1 text-center hidden md:block"
                  style={{ color: i === step ? NAVY : "#6b7280" }}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-4"
                  style={{ backgroundColor: i < step ? "#16a34a" : "#e5e7eb" }} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {/* Step 0: Child Details */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold mb-6" style={{ color: NAVY }}>Child's Details</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="First Name" required>
                    <Input value={form.childFirstName} onChange={set("childFirstName")} placeholder="Child's first name" />
                    {errors.childFirstName && <p className="text-red-500 text-xs mt-1">{errors.childFirstName}</p>}
                  </Field>
                  <Field label="Last Name / Surname" required>
                    <Input value={form.childLastName} onChange={set("childLastName")} placeholder="Child's surname" />
                    {errors.childLastName && <p className="text-red-500 text-xs mt-1">{errors.childLastName}</p>}
                  </Field>
                  <Field label="Date of Birth" required>
                    <Input type="date" value={form.childDob} onChange={set("childDob")} />
                    {errors.childDob && <p className="text-red-500 text-xs mt-1">{errors.childDob}</p>}
                  </Field>
                  <Field label="Gender" required>
                    <Select value={form.childGender} onChange={set("childGender")}>
                      <option value="">Select gender...</option>
                      <option>Male</option>
                      <option>Female</option>
                    </Select>
                    {errors.childGender && <p className="text-red-500 text-xs mt-1">{errors.childGender}</p>}
                  </Field>
                  <Field label="Class Applying For" required>
                    <Select value={form.classApplyingFor} onChange={set("classApplyingFor")}>
                      <option value="">Select class...</option>
                      {CLASSES.map(c => <option key={c}>{c}</option>)}
                    </Select>
                    {errors.classApplyingFor && <p className="text-red-500 text-xs mt-1">{errors.classApplyingFor}</p>}
                  </Field>
                  <Field label="Previous School (if any)">
                    <Input value={form.previousSchool} onChange={set("previousSchool")} placeholder="Name of previous school" />
                  </Field>
                </div>
              </motion.div>
            )}

            {/* Step 1: Parent Details */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold mb-6" style={{ color: NAVY }}>Parent / Guardian Details</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <Input value={form.parentName} onChange={set("parentName")} placeholder="Parent/Guardian full name" />
                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                  </Field>
                  <Field label="Relationship to Child" required>
                    <Select value={form.parentRelationship} onChange={set("parentRelationship")}>
                      <option value="">Select relationship...</option>
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Guardian</option>
                      <option>Uncle</option>
                      <option>Aunt</option>
                      <option>Grandparent</option>
                      <option>Other</option>
                    </Select>
                    {errors.parentRelationship && <p className="text-red-500 text-xs mt-1">{errors.parentRelationship}</p>}
                  </Field>
                  <Field label="Phone Number" required>
                    <Input value={form.parentPhone} onChange={set("parentPhone")} placeholder="07XXXXXXXXX" />
                    {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                  </Field>
                  <Field label="Second Phone Number (optional)">
                    <Input value={form.parentPhone2} onChange={set("parentPhone2")} placeholder="08XXXXXXXXX" />
                  </Field>
                  <Field label="Email Address (Gmail)" required>
                    <Input type="email" value={form.parentEmail} onChange={set("parentEmail")} placeholder="your.email@gmail.com" />
                    {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                    <p className="text-xs text-gray-500 mt-1">You will receive application updates (reviewed, accepted, rejected) to this email.</p>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Home Address" required>
                      <textarea value={form.parentAddress} onChange={e => set("parentAddress")(e.target.value)}
                        rows={3} placeholder="Full home address..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                        onFocus={e => (e.currentTarget.style.borderColor = NAVY)}
                        onBlur={e => (e.currentTarget.style.borderColor = "")}
                      />
                      {errors.parentAddress && <p className="text-red-500 text-xs mt-1">{errors.parentAddress}</p>}
                    </Field>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Additional Info */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold mb-6" style={{ color: NAVY }}>Additional Information</h3>
                <div className="space-y-5">
                  <Field label="How did you hear about us?">
                    <Select value={form.howDidYouHear} onChange={set("howDidYouHear")}>
                      <option value="">Select an option...</option>
                      <option>Friend / Family Recommendation</option>
                      <option>Current Parent at the School</option>
                      <option>Signboard / Roadside Banner</option>
                      <option>Social Media (Facebook, WhatsApp, etc.)</option>
                      <option>Church / Religious Community</option>
                      <option>Google / Internet Search</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <Field label="Anything else we should know? (optional)">
                    <textarea value={form.additionalInfo} onChange={e => set("additionalInfo")(e.target.value)}
                      rows={5} placeholder="Any medical conditions, special needs, or other information you'd like us to know about your child..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                      onFocus={e => (e.currentTarget.style.borderColor = NAVY)}
                      onBlur={e => (e.currentTarget.style.borderColor = "")}
                    />
                  </Field>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold mb-6" style={{ color: NAVY }}>Review Your Application</h3>
                <div className="space-y-5">
                  {[
                    { title: "Child's Details", items: [
                      ["Full Name", `${form.childFirstName} ${form.childLastName}`],
                      ["Date of Birth", form.childDob],
                      ["Gender", form.childGender],
                      ["Class Applying For", form.classApplyingFor],
                      ["Previous School", form.previousSchool || "None"],
                    ]},
                    { title: "Parent / Guardian", items: [
                      ["Name", form.parentName],
                      ["Relationship", form.parentRelationship],
                      ["Phone", form.parentPhone],
                      ["Second Phone", form.parentPhone2 || "—"],
                      ["Email", form.parentEmail || "—"],
                      ["Address", form.parentAddress],
                    ]},
                    { title: "Additional Info", items: [
                      ["How did you hear?", form.howDidYouHear || "—"],
                      ["Additional notes", form.additionalInfo || "None"],
                    ]},
                  ].map(section => (
                    <div key={section.title} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2.5 font-bold text-sm text-white" style={{ backgroundColor: NAVY }}>{section.title}</div>
                      <div className="divide-y divide-gray-100">
                        {section.items.map(([label, value]) => (
                          <div key={label} className="flex gap-4 px-4 py-2.5">
                            <span className="text-xs font-semibold text-gray-500 w-36 flex-shrink-0">{label}</span>
                            <span className="text-sm text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {mutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                      Something went wrong. Please try again or call us on 07036500419.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={back} disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < 3 ? (
              <button onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: NAVY }}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={mutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60" style={{ backgroundColor: RED }}>
                {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Application <ChevronRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Questions? Call us on <a href="tel:07036500419" className="font-semibold hover:underline" style={{ color: NAVY }}>07036500419</a> or <a href="tel:08032348460" className="font-semibold hover:underline" style={{ color: NAVY }}>08032348460</a>
        </p>
      </section>
    </Layout>
  );
}
