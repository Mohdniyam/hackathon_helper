"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Star,
  Search,
  Filter,
  Plus,
} from "lucide-react";

interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  rating: number;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "All",
    "AI/ML",
    "Backend",
    "Frontend",
    "Database",
    "Design",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [newResource, setNewResource] = useState<Resource>({
    id: Date.now(),
    name: "",
    description: "",
    url: "",
    category: "",
    rating: 0,
  });

  // Load resources and categories from localStorage on mount
  useEffect(() => {
    const savedResources = localStorage.getItem("customResources");
    const savedCategories = localStorage.getItem("customCategories");

    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      const defaultResources = [
        {
          id: 1,
          name: "OpenAI API",
          description: "GPT-4 and GPT-3.5 API for building AI applications",
          url: "https://openai.com/api",
          category: "AI/ML",
          rating: 5,
        },
        {
          id: 2,
          name: "Firebase",
          description: "Real-time database and backend services",
          url: "https://firebase.google.com",
          category: "Backend",
          rating: 4,
        },
        {
          id: 3,
          name: "React Documentation",
          description: "Official React docs and guides",
          url: "https://react.dev",
          category: "Frontend",
          rating: 5,
        },
        {
          id: 4,
          name: "Tailwind CSS",
          description: "Utility-first CSS framework",
          url: "https://tailwindcss.com",
          category: "Frontend",
          rating: 5,
        },
        {
          id: 5,
          name: "MongoDB",
          description: "NoSQL database for flexible data storage",
          url: "https://www.mongodb.com",
          category: "Database",
          rating: 4,
        },
      ];
      setResources(defaultResources);
      localStorage.setItem("customResources", JSON.stringify(defaultResources));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Add new resource logic
  const handleAddResource = () => {
    if (
      !newResource.name ||
      !newResource.description ||
      !newResource.url ||
      !newResource.category ||
      !newResource.rating
    ) {
      alert("Please fill all fields before adding a resource.");
      return;
    }

    const updatedResources = [...resources, { ...newResource, id: Date.now() }];
    setResources(updatedResources);
    localStorage.setItem("customResources", JSON.stringify(updatedResources));

    // If new category is not already in the list, add it
    if (
      newResource.category.trim() &&
      !categories.includes(newResource.category)
    ) {
      const updatedCategories = [...categories, newResource.category];
      setCategories(updatedCategories);
      localStorage.setItem(
        "customCategories",
        JSON.stringify(updatedCategories)
      );
    }

    // Reset form
    setNewResource({
      id: Date.now(),
      name: "",
      description: "",
      url: "",
      category: "",
      rating: 0,
    });
  };

  const filteredResources = resources.filter(
    (r) =>
      (selectedCategory === "All" || r.category === selectedCategory) &&
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Resource Library
        </h1>
        <p className="text-muted-foreground">
          APIs, tools, templates, and documentation
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg font-medium transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add Resource Form */}
      <div className="border border-border p-4 rounded-lg space-y-3 bg-muted/20">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Add New Resource
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newResource.name}
            onChange={(e) =>
              setNewResource({ ...newResource, name: e.target.value })
            }
            className="p-2 rounded border bg-background text-foreground w-full"
          />
          <input
            type="text"
            placeholder="Category"
            value={newResource.category}
            onChange={(e) =>
              setNewResource({ ...newResource, category: e.target.value })
            }
            className="p-2 rounded border bg-background text-foreground w-full"
          />
        </div>
        <textarea
          placeholder="Description"
          value={newResource.description}
          onChange={(e) =>
            setNewResource({ ...newResource, description: e.target.value })
          }
          className="p-2 rounded border bg-background text-foreground w-full"
        />
        <input
          type="text"
          placeholder="URL"
          value={newResource.url}
          onChange={(e) =>
            setNewResource({ ...newResource, url: e.target.value })
          }
          className="p-2 rounded border bg-background text-foreground w-full"
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={newResource.rating}
          onChange={(e) =>
            setNewResource({ ...newResource, rating: Number(e.target.value) })
          }
          className="p-2 rounded border bg-background text-foreground w-full"
          min={1}
          max={5}
        />
        <button
          onClick={handleAddResource}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
        >
          Add Resource
        </button>
      </div>

      {/* Resources Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 bg-muted/30 border border-border rounded-lg hover:border-muted-foreground/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {resource.name}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                    {resource.category}
                  </span>
                </div>
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {resource.description}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < resource.rating
                      ? "fill-accent text-accent"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted-foreground">No resources found</p>
        </div>
      )}
    </div>
  );
}
