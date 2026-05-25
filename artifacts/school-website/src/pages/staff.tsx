import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListStaff } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const NAVY = "#1a237e";
const RED = "#CC2200";

const DEPARTMENTS = ["All", "Leadership", "Early Years & Nursery", "Primary", "Junior Secondary", "Support Staff"];

export default function Staff() {
  const [dept, setDept] = useState("All");
  const { data: staff, isLoading } = useListStaff(dept !== "All" ? { department: dept } : {});

  return (
    <Layout>
      <PageHero
        title="Our Staff"
        subtitle="Meet the dedicated team who make Triple Tee Montessori Academy exceptional"
        breadcrumb="Home / About Us / Our Staff"
      />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-wrap gap-2 mb-8">
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                dept === d
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-300"
              )}
              style={dept === d ? { backgroundColor: NAVY, borderColor: NAVY } : undefined}
              onMouseEnter={(e) => { if (dept !== d) { (e.currentTarget as HTMLElement).style.borderColor = NAVY; (e.currentTarget as HTMLElement).style.color = NAVY; } }}
              onMouseLeave={(e) => { if (dept !== d) { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.color = ""; } }}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
            : (
              <AnimatePresence>
                {staff?.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                    style={{ cursor: "default" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = NAVY; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                  >
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-40 object-cover bg-blue-50"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{member.name}</h3>
                      <p className="text-xs font-semibold mt-0.5 mb-1" style={{ color: NAVY }}>{member.role}</p>
                      <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mb-2">{member.department}</span>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>Join Our Team</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-5">
            We are always looking for passionate, faith-driven educators to join the Triple Tee family. If you share our vision of building God-centred futures, we'd love to hear from you.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: NAVY }}>
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout>
  );
}
