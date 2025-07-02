import { NextRequest } from "next/server";
import {
  CREATE_CATEGORY,
  FETCH_CATEGORIES_BY_WORKSPACE,
  DELETE_CATEGORIES,
  UPDATE_CATEGORY,
} from "@/services/category.service";
import { authMiddleware } from "@/app/api/middleware/authMiddleware";

// POST /api/category
export async function POST(request: NextRequest) {
  const user = await authMiddleware(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, workspaceId } = body;

    const category = await CREATE_CATEGORY({
      name,
      description,
      workspaceId,
    });

    if (!category) {
      return Response.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Category created successfully", data: category },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error in creating category", error },
      { status: 500 }
    );
  }
}

// GET /api/category?workspace_id=123
export async function GET(request: NextRequest) {
  const user = await authMiddleware(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = Number(searchParams.get("workspace_id"));

    if (!workspaceId) {
      return Response.json(
        { message: "Missing workspace_id" },
        { status: 400 }
      );
    }

    const categories = await FETCH_CATEGORIES_BY_WORKSPACE(workspaceId);

    return Response.json(categories, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error fetching categories", error },
      { status: 500 }
    );
  }
}

// PUT /api/category
export async function PUT(request: NextRequest) {
  const user = await authMiddleware(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, description } = body;

    if (!id) {
      return Response.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const updated = await UPDATE_CATEGORY(id, { name, description });

    if (!updated) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Category updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error updating category", error },
      { status: 500 }
    );
  }
}

// DELETE /api/category?id=123
export async function DELETE(request: NextRequest) {
  const user = await authMiddleware(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return Response.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const deleted = await DELETE_CATEGORIES(id);

    if (!deleted) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error deleting category", error },
      { status: 500 }
    );
  }
}