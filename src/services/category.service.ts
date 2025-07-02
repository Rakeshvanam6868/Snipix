import prisma from "@/lib/prisma";
import { Category } from "@/types/category";

// Create a new category
export async function CREATE_CATEGORY(data: {
  name: string;
  description: string;
  workspaceId: number;
}): Promise<Category | null> {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        workspace: {
          connect: { id: data.workspaceId },
        },
      },
    });
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

// Fetch all categories by workspace
export async function FETCH_CATEGORIES_BY_WORKSPACE(workspaceId: number): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Delete a category
export async function DELETE_CATEGORIES(categoryId: number): Promise<boolean> {
  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}

// Update a category
export async function UPDATE_CATEGORY(
  categoryId: number,
  data: Partial<{ name: string; description: string }>
): Promise<Category | null> {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data,
    });
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
}