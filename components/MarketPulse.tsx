import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';

interface NewsItem {
  headline: string;
  link: string;
  source: string;
}

export const MarketPulse: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError('Unable to load news at this time.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-slate-400">{error}</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-100">Market News</h2>
      </div>
      <div className="space-y-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex justify-between items-start gap-4">
              <p className="text-slate-300 text-sm group-hover:text-amber-400 transition-colors">
                {item.headline}
              </p>
              <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-amber-500 shrink-0" />
            </div>
            <span className="text-slate-500 text-[10px] uppercase tracking-wider mt-1 block">
              {item.source}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
