"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Star,
  Search,
  Filter,
  Plus,
  Trash2,
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
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    url: "",
    category: "",
    rating: 0,
  });

  /* -------------------------------------------
      LOAD RESOURCES FROM BACKEND
  -------------------------------------------- */
  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/resources");
      const json = await res.json();

      if (json.success) {
        setResources(json.data);

        const uniqueCategories = Array.from(
          new Set(json.data.map((r: Resource) => r.category))
        );
        setCategories(["All", ...uniqueCategories]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* -------------------------------------------
      ADD RESOURCE (POST)
  -------------------------------------------- */
  const handleAddResource = async () => {
    const { name, description, url, category, rating } = newResource;

    if (!name || !description || !url || !category || rating < 1) {
      alert("Please fill all fields before adding a resource.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      });

      const json = await res.json();
      if (json.success) {
        setNewResource({
          name: "",
          description: "",
          url: "",
          category: "",
          rating: 0,
        });
        fetchResources();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------------------------
      DELETE RESOURCE
  -------------------------------------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this resource?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/resources/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (json.success) fetchResources();
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------------------------
      RATE RESOURCE (PATCH)
  -------------------------------------------- */
  const handleRating = async (id: number, rating: number) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/resources/${id}/rate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        }
      );

      const json = await res.json();
      if (json.success) {
        setResources(json.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------------------------
      FILTERING
  -------------------------------------------- */
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

      {/* Search + Filter */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add Resource */}
      <div className="border p-4 rounded-lg space-y-3 bg-gray-50">
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
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newResource.category}
            onChange={(e) =>
              setNewResource({ ...newResource, category: e.target.value })
            }
            className="p-2 border rounded"
          />
        </div>

        <textarea
          placeholder="Description"
          value={newResource.description}
          onChange={(e) =>
            setNewResource({ ...newResource, description: e.target.value })
          }
          className="p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder="URL"
          value={newResource.url}
          onChange={(e) =>
            setNewResource({ ...newResource, url: e.target.value })
          }
          className="p-2 border rounded w-full"
        />

        <input
          type="number"
          placeholder="Rating (1-5)"
          min={1}
          max={5}
          value={newResource.rating}
          onChange={(e) =>
            setNewResource({
              ...newResource,
              rating: Number(e.target.value),
            })
          }
          className="p-2 border rounded w-full"
        />

        <button
          onClick={handleAddResource}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Add Resource
        </button>
      </div>

      {/* Resource Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 bg-white border rounded-lg shadow"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{resource.name}</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {resource.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={
                    resource.url.startsWith("http://") ||
                    resource.url.startsWith("https://")
                      ? resource.url
                      : `https://${resource.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                </a>

                <button
                  onClick={() => handleDelete(resource.id)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
            </div>

            <p className="text-sm mt-2">{resource.description}</p>

            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= resource.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
