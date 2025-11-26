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
    setCategories(res.data.data); // array of objects
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
        {/* <div className="flex items-center gap-2 bg-white mt-4 p-2 rounded">
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
        </div> */}
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
                <button
                  onClick={() => voteIdea(idea.id)}
                  className="
    group flex items-center gap-1 px-3 py-1 rounded
    bg-secondary/10 text-secondary
    hover:bg-blue-100 hover:text-blue-600
    active:scale-90 transition-all
  "
                >
                  <ThumbsUp
                    className="
      w-4 h-4 transition-all
      group-hover:text-blue-600
    "
                  />
                  {idea.votes}
                </button>

                <button
                  onClick={() => pinIdea(idea.id)}
                  className="
    group p-2 rounded
    bg-muted text-muted-foreground
    hover:bg-yellow-100 hover:text-yellow-600
    active:scale-90 transition-all
  "
                >
                  <Pin className="w-4 h-4 transition-all group-hover:text-yellow-600" />
                </button>

                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="
    group p-2 rounded bg-muted text-muted-foreground
    hover:bg-red-100 hover:text-red-600
    active:scale-90 transition-all
  "
                >
                  <Trash2
                    className="
      w-4 h-4 transition-all
      group-hover:text-red-600
    "
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Lightbulb, ThumbsUp, Pin, Trash2, Plus } from "lucide-react";

// interface Idea {
//   id: number;
//   title: string;
//   description: string;
//   votes: number;
//   category: string;
//   isPinned: boolean;
// }

// export default function Ideas() {
//   const [ideas, setIdeas] = useState<Idea[]>([
//     {
//       id: 1,
//       title: "AI-Powered Code Generator",
//       description: "Voice-to-code generator using ChatGPT API",
//       votes: 12,
//       category: "AI/ML",
//       isPinned: true,
//     },
//     {
//       id: 2,
//       title: "Real-time Collaboration Tool",
//       description: "Live code sharing and pair programming platform",
//       votes: 8,
//       category: "Dev Tools",
//       isPinned: false,
//     },
//     {
//       id: 3,
//       title: "Sustainability Tracker",
//       description:
//         "Track carbon footprint and suggest eco-friendly alternatives",
//       votes: 5,
//       category: "Sustainability",
//       isPinned: false,
//     },
//   ]);

//   const [newIdea, setNewIdea] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newCategory, setNewCategory] = useState("General");

//   const categories = [
//     "General",
//     "AI/ML",
//     "Dev Tools",
//     "Sustainability",
//     "Education",
//     "Health",
//   ];

//   const handleAddIdea = () => {
//     if (newIdea.trim()) {
//       setIdeas([
//         ...ideas,
//         {
//           id: Date.now(),
//           title: newIdea,
//           description: newDescription,
//           votes: 0,
//           category: newCategory,
//           isPinned: false,
//         },
//       ]);
//       setNewIdea("");
//       setNewDescription("");
//       setNewCategory("General");
//     }
//   };

//   const voteIdea = (id: number) => {
//     setIdeas(
//       ideas.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i))
//     );
//   };

//   const pinIdea = (id: number) => {
//     setIdeas(
//       ideas.map((i) => (i.id === id ? { ...i, isPinned: !i.isPinned } : i))
//     );
//   };

//   const deleteIdea = (id: number) => {
//     setIdeas(ideas.filter((i) => i.id !== id));
//   };

//   const sortedIdeas = [...ideas].sort((a, b) => {
//     if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
//     return b.votes - a.votes;
//   });

//   return (
//     <div className="p-6 space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground mb-2">Idea Board</h1>
//         <p className="text-muted-foreground">
//           Brainstorm and vote on project ideas
//         </p>
//       </div>

//       {/* Add New Idea */}
//       <div className="bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/30 rounded-lg p-6">
//         <h3 className="font-semibold text-foreground mb-4">Share Your Idea</h3>
//         <div className="space-y-3">
//           <input
//             type="text"
//             value={newIdea}
//             onChange={(e) => setNewIdea(e.target.value)}
//             placeholder="Idea title..."
//             className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//           />
//           <textarea
//             value={newDescription}
//             onChange={(e) => setNewDescription(e.target.value)}
//             placeholder="Brief description..."
//             className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20"
//           />
//           <div className="flex gap-3">
//             <select
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
//             >
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleAddIdea}
//               className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               Add
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Ideas List */}
//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold text-foreground">
//           All Ideas ({ideas.length})
//         </h2>
//         {sortedIdeas.map((idea) => (
//           <div
//             key={idea.id}
//             className={`p-4 border rounded-lg transition-colors ${
//               idea.isPinned
//                 ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/10"
//                 : "bg-muted/30 border-border hover:border-muted-foreground/30"
//             }`}
//           >
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Lightbulb
//                     className={`w-4 h-4 ${idea.isPinned ? "text-primary" : "text-secondary"}`}
//                   />
//                   <h3 className="font-semibold text-foreground">
//                     {idea.title}
//                   </h3>
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-2">
//                   {idea.description}
//                 </p>
//                 <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded">
//                   {idea.category}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => voteIdea(idea.id)}
//                   className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors font-medium text-sm"
//                 >
//                   <ThumbsUp className="w-4 h-4" />
//                   {idea.votes}
//                 </button>
//                 <button
//                   onClick={() => pinIdea(idea.id)}
//                   className={`p-2 rounded-lg transition-colors ${
//                     idea.isPinned
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-muted text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   <Pin className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => deleteIdea(idea.id)}
//                   className="p-2 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-accent rounded-lg transition-colors"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
