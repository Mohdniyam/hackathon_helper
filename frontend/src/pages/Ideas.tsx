"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, Pin, Trash2, Plus } from "lucide-react";

// Idea type
interface Idea {
  id: number;
  title: string;
  description: string;
  votes: number;
  category: string;
  isPinned: boolean;
}

// Category type
interface Category {
  id: number;
  name: string;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [newIdea, setNewIdea] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // New category
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch Ideas
  const fetchIdeas = async () => {
    const res = await axios.get("http://localhost:3000/api/ideas");
    setIdeas(res.data.data);
  };

  // Fetch Categories
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3000/api/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchIdeas();
    fetchCategories();
  }, []);

  // Add Idea
  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;

    const res = await axios.post("http://localhost:3000/api/ideas", {
      title: newIdea,
      description: newDescription,
      category: newCategory,
    });

    setIdeas((prev) => [...prev, res.data.data]);
    setNewIdea("");
    setNewDescription("");
    setNewCategory("");
  };

  // Add Category
  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    await axios.post("http://localhost:3000/api/categories", {
      name: newCategoryName,
    });

    fetchCategories();
    setNewCategoryName("");
  };

  // Vote Idea
  const voteIdea = async (id: number) => {
    const res = await axios.patch(`http://localhost:3000/api/ideas/${id}/vote`);
    setIdeas(res.data.data);
  };

  // Pin Idea
  const pinIdea = async (id: number) => {
    const res = await axios.patch(`http://localhost:3000/api/ideas/${id}/pin`);
    setIdeas(res.data.data);
  };

  // Delete Idea
  const deleteIdea = async (id: number) => {
    await axios.delete(`http://localhost:3000/api/ideas/${id}`);
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  // Sort pinned + votes
  const sortedIdeas = [...ideas].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return b.votes - a.votes;
  });

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Idea Board</h1>
        <p className="text-muted-foreground">Brainstorm and vote on ideas</p>
      </div>

      {/* Add New Idea */}
      <div className="bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Share Your Idea</h3>

        <div className="space-y-3">
          <input
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="Idea title..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
          />

          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Brief description..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm h-20"
          />

          {/* Category Dropdown */}
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddIdea}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Add New Category */}
        <div className="flex items-center gap-2 bg-white mt-4 p-2 rounded">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Add new category..."
            className="w-full px-3 py-2 border rounded"
          />

          <button
            onClick={addCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          All Ideas ({ideas.length})
        </h2>

        {sortedIdeas.map((idea) => (
          <div
            key={idea.id}
            className={`p-4 border rounded-lg ${
              idea.isPinned
                ? "bg-primary/5 border-primary/30 shadow-lg"
                : "bg-muted/30 border-border"
            }`}
          >
            <div className="flex justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{idea.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {idea.description}
                </p>
                <span className="px-2 py-1 bg-secondary/10 text-xs rounded">
                  {idea.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* LIKE BUTTON (blue when voted) */}
                <button
                  onClick={() => voteIdea(idea.id)}
                  className={`px-3 py-1 rounded flex items-center gap-1 transition
                    ${
                      idea.votes > 0
                        ? "bg-blue-600 text-white shadow"
                        : "bg-secondary/10 text-foreground"
                    }
                  `}
                >
                  <ThumbsUp className="w-4 h-4" /> {idea.votes}
                </button>

                {/* PIN BUTTON (yellow when pinned) */}
                <button
                  onClick={() => pinIdea(idea.id)}
                  className={`p-2 rounded transition 
                    ${
                      idea.isPinned
                        ? "bg-yellow-400 text-black shadow"
                        : "bg-muted text-foreground"
                    }`}
                >
                  <Pin className="w-4 h-4" />
                </button>

                {/* DELETE BUTTON (red hover) */}
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="p-2 rounded bg-red-500/20 text-red-600 hover:bg-red-500/40 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
