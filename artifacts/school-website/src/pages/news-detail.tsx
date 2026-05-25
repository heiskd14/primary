import { Link } from "wouter";
import { useGetNews, useListNews } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsDetail({ id }: { id: number }) {
  const { data: article, isLoading } = useGetNews(id);
  const { data: allNews } = useListNews({ limit: 3 });

  const related = allNews?.filter(n => n.id !== id).slice(0, 2);

  return (
    <Layout>
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-[#1a3c6e] font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to News & Events
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : article ? (
          <>
            <div className="mb-3">
              <span className="inline-block text-xs font-bold bg-blue-100 text-[#1a3c6e] px-3 py-1 rounded-full">{article.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {article.author}</span>
            </div>

            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-72 md:h-96 object-cover rounded-2xl mb-8 shadow-sm"
            />

            <div className="prose prose-lg prose-gray max-w-none">
              {article.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Article not found.</p>
            <Link href="/news" className="mt-4 inline-block text-[#1a3c6e] font-semibold hover:underline">Back to news</Link>
          </div>
        )}

        {related && related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1a3c6e] mb-5">More News</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {related.map(n => (
                <Link key={n.id} href={`/news/${n.id}`}>
                  <div className="flex gap-3 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-[#1a3c6e] transition-all group cursor-pointer">
                    <img src={n.imageUrl} alt={n.title} className="w-24 object-cover flex-shrink-0" />
                    <div className="p-3">
                      <span className="text-xs font-bold bg-blue-100 text-[#1a3c6e] px-2 py-0.5 rounded mb-1 inline-block">{n.category}</span>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1a3c6e] line-clamp-2 transition-colors">{n.title}</h3>
                      <span className="text-xs text-[#1a3c6e] font-semibold mt-1 flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
