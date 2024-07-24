"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BrandEditorProps {
  brand: { id: string; name: string };
}

const BrandEditor: React.FC<BrandEditorProps> = ({ brand }) => {
  const [name, setName] = useState(brand.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
        router.push("/analytics");
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
        router.push("/analytics");
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
    <Card className="p-5 m-5 gap-5 flex flex-col">
      <CardTitle className="text-3xl font-bold">Edit Brand</CardTitle>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex w-full gap-5">
      <Button onClick={handleUpdate} disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update"}
      </Button>
      <Button onClick={handleDelete} disabled={isSubmitting}>
        {isSubmitting ? "Deleting..." : "Delete"}
      </Button>
      </div>

    </Card>
  );
};

export default BrandEditor;
