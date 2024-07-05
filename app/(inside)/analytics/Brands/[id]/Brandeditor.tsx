"use client";
import { useState } from "react";
import { toast } from "sonner";

interface BrandEditorProps {
  brand: { id: string; name: string };
}

const BrandEditor: React.FC<BrandEditorProps> = ({ brand }) => {
  const [name, setName] = useState(brand.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/brands/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: brand.id, name }),
      });
      if (response.ok) {
        toast.success("Brand updated successfully");
      } else {
        toast.error("Failed to update brand");
      }
    } catch (error) {
      toast.error("An error occurred while updating the brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/brands/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: brand.id }),
      });
      if (response.ok) {
        toast.success("Brand deleted successfully");
        // Optionally, redirect or update the UI after deletion
      } else {
        toast.error("Failed to delete brand");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Edit Brand</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />
      <button onClick={handleUpdate} disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update"}
      </button>
      <button onClick={handleDelete} disabled={isSubmitting}>
        {isSubmitting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default BrandEditor;
