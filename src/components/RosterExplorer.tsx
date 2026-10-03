'use client';

import React, { useState, useEffect } from 'react';
import { Person } from '@/lib/types';
import { Search, ArrowUpDown, Sparkles, Users, Flame, Crown } from 'lucide-react';
import { PersonCard } from './PersonCard';

interface RosterExplorerProps {
  onInspectPerson: (person: Person) => void;
  onDraftPerson?: (person: Person) => void;
}

export function RosterExplorer({ onInspectPerson, onDraftPerson }: RosterExplorerProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('latent_fit');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(2000);
  const limit = 24;

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (selectedCategory && selectedCategory !== 'All') {
          params.set('category', selectedCategory);
        }
        params.set('limit', limit.toString());
        params.set('offset', ((page - 1) * limit).toString());

        const res = await fetch(`/api/people?${params.toString()}`);
        const data = await res.json();

        if (data.people) {
          let list: Person[] = data.people;
          list = list.sort((a, b) => {
            const valA = (a as unknown as Record<string, number>)[sortBy] ?? 0;
            const valB = (b as unknown as Record<string, number>)[sortBy] ?? 0;
            return valB - valA;
          });
          setPeople(list);
          setTotal(data.total);
        }
        if (data.categories && categories.length === 0) {
          setCategories(['All', ...data.categories]);
        }
      } catch (err) {
        console.error('Failed to load roster:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPeople, 180);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sortBy, page]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-white/[0.1] bg-gradient-to-r from-[#d4ff00]/10 via-[#0e101d] to-[#1a1428] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="latent-sticker rounded-md bg-[#d4ff00] px-2.5 py-0.5 text-xs font-black text-black">
              🗂️ 2,000 VERIFIED ICONS
            </span>
            <span className="text-xs text-[#d4ff00] font-bold">India's Got Latent Database</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
            Public Figure Index
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Inspect comedians, content creators, Bollywood stars, athletes, and internet personalities indexed for chemistry, chaos, and comedic compatibility.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/80 px-4 py-2.5 rounded-2xl border border-[#d4ff00]/30 self-start md:self-auto">
          <span className="text-xs text-zinc-400 font-bold uppercase">Indexed:</span>
          <span className="text-xl font-black text-[#d4ff00]">{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Controls Bar: Search, Category Chips & Sort */}
      <div className="p-5 rounded-3xl border border-white/[0.08] bg-[#0c0e17]/90 backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search 2,000 public figures..."
              className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="h-4 w-4 text-zinc-500 shrink-0" />
            <span className="text-xs font-black uppercase text-zinc-400 shrink-0">Rank by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto rounded-xl border border-white/[0.1] bg-[#0c0e17] px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#d4ff00]"
            >
              <option value="latent_fit">Latent Fit Score</option>
              <option value="comedy_score">Comedy Score</option>
              <option value="chaos_score">Chaos Index</option>
              <option value="viral_potential">Viral Potential</option>
              <option value="roastability">Roastability</option>
              <option value="celebrity_factor">Celebrity Factor</option>
              <option value="energy_level">Energy Level</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 font-black uppercase text-[11px] whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#d4ff00] text-black shadow-md shadow-[#d4ff00]/25'
                    : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Person Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Sparkles className="h-6 w-6 animate-spin text-[#d4ff00] mb-2" />
          <p className="text-sm font-bold">Scanning 2,000 public figures...</p>
        </div>
      ) : people.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 text-sm">
          No public figures found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {people.map((person) => (
            <PersonCard
              key={person.person_id}
              person={person}
              onInspect={onInspectPerson}
              showActions={false}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.08] bg-[#0c0e17]">
        <div className="text-xs text-zinc-400 font-medium">
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3.5 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs font-bold text-zinc-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-white/[0.08]"
          >
            Previous
          </button>
          <span className="text-xs font-black text-white px-2">Page {page}</span>
          <button
            type="button"
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3.5 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs font-bold text-zinc-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-white/[0.08]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
