'use client';

import React, { useState, useEffect } from 'react';
import { Person } from '@/lib/types';
import { Search, X, Check, Users, Sparkles, Filter } from 'lucide-react';

interface PersonPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
  excludeIds?: string[];
  title?: string;
  subtitle?: string;
}

export function PersonPickerModal({
  isOpen,
  onClose,
  onSelect,
  excludeIds = [],
  title = 'Select Public Figure',
  subtitle = 'Choose from 2,000 verified public figures across Indian comedy and media',
}: PersonPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [people, setPeople] = useState<Person[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('q', search);
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        queryParams.set('limit', '30');

        const res = await fetch(`/api/people?${queryParams.toString()}`);
        const data = await res.json();
        if (data.people) {
          setPeople(data.people);
        }
        if (data.categories && categories.length === 0) {
          setCategories(['All', ...data.categories]);
        }
      } catch (err) {
        console.error('Failed to search people:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/[0.12] bg-[#0c0e17] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              {title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-white/[0.06] space-y-3 bg-white/[0.01]">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, profession, or topic..."
              className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              autoFocus
            />
          </div>

          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-zinc-500 text-sm">
              <Sparkles className="h-4 w-4 animate-spin mr-2 text-purple-400" />
              Searching 2,000 public figures...
            </div>
          ) : people.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No matching public figures found. Try a different name or category.
            </div>
          ) : (
            people.map((p) => {
              const isExcluded = excludeIds.includes(p.person_id);
              return (
                <div
                  key={p.person_id}
                  onClick={() => {
                    if (!isExcluded) {
                      onSelect(p);
                      onClose();
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isExcluded
                      ? 'opacity-40 border-white/[0.03] bg-transparent cursor-not-allowed'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-purple-950/20 hover:border-purple-500/40 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-11 w-11 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{p.name}</div>
                      <div className="text-xs text-zinc-400">
                        {p.profession} &bull; <span className="text-purple-400">{p.category}</span>
                      </div>
                      {p.known_for && (
                        <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {p.known_for}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Comedy / Chaos</div>
                      <div className="text-xs font-bold text-zinc-300">
                        {p.comedy_score} / {p.chaos_score}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isExcluded}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        isExcluded
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-purple-500 text-white hover:bg-purple-600 shadow-sm'
                      }`}
                    >
                      {isExcluded ? 'Added' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
