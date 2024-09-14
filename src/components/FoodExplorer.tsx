import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Handle,
  Position,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import Sidebar from "./SideBar";
import EntityNode from "./EntityNode";
import ExploreNode from "./ExploreNode";
import OptionNode from "./OptionNode";
import MealNode from "./MealNode";
import IngredientTagNode from "./IngredientTagNode";

// Custom node with handles on both sides

// Initial "Explore" node data
const initialNodes: Node[] = [
  {
    id: "1",
    type: "exploreNode", // Use custom node type
    data: { label: "🌐 Explore" },
    position: { x: 0, y: 0 }, // Fixed position for the "Explore" node
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  exploreNode: ExploreNode,
  categoryNode: EntityNode,
  optionNode: OptionNode,
  mealNode: MealNode,
  ingredientTagNode: IngredientTagNode,
};

const FoodExplorer: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [categoryClicked, setCategoryClicked] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [exploreclicked, setexplorelicked] = useState(false);
  const [mealClicked, setMealClicked] = useState(false);
  const [itclicked, setitclicked] = useState(false);

  // Function to fetch top-5 categories from the API and create nodes/edges
  const fetchCategories = useCallback(async (nodeId: string) => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const categories = response.data.categories.slice(0, 5); // Get the top 5 categories

      // Create new category nodes
      const newNodes = categories.map((category: any, index: number) => ({
        id: `${nodeId}-${index + 2}`, // Unique ID for each new node
        type: "categoryNode",
        data: { label: category.strCategory }, // Use category name as label
        position: { x: 300, y: -200 + index * 100 }, // Position them horizontally
      }));

      // Create new edges connecting the "Explore" node to each new category node
      const newEdges = categories.map((category: any, index: number) => ({
        id: `e1-${index + 2}`, // Unique ID for each edge
        source: "1", // "Explore" node as the source
        target: `${nodeId}-${index + 2}`, // Each category node as the target
        type: "default", // Edge type
        markerEnd: {
          type: "arrowclosed",
          width: 20, // Increase the arrow width
          height: 20, // Defines the arrow type
        },
      }));

      // Log the nodes and edges for debugging
      console.log("New Nodes:", newNodes);
      console.log("New Edges:", newEdges);

      // Add new nodes and edges to the state
      setNodes((nds) => nds.concat(newNodes));
      setEdges((eds) => eds.concat(newEdges));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const addViewMealsNode = useCallback((categoryNodeId: string) => {
    const viewMealsNode = {
      id: `${categoryNodeId}-view-meals`,
      type: "optionNode",
      data: { label: "View Meals" }, // Label for "View Meals" node
      position: { x: 600, y: 0 }, // Position below category node
    };

    const newEdge = {
      id: `e-${categoryNodeId}-view-meals`,
      source: categoryNodeId, // Source: category node
      target: `${categoryNodeId}-view-meals`, // Target: "View Meals" node
      type: "default",
    };
    setCategoryClicked(categoryNodeId);
    // Add the "View Meals" node and edge to the state
    setNodes((nds) => nds.concat(viewMealsNode));
    setEdges((eds) => eds.concat(newEdge));
  }, []);

  const fetchMeals = useCallback(
    async (viewMealsNodeId: string, category: string) => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );
        const meals = response.data.meals.slice(0, 5); // Get the top 5 meals

        // Create meal nodes
        const newMealNodes = meals.map((meal: any, index: number) => ({
          id: `${viewMealsNodeId}-${meal.idMeal}`, // Unique ID for each meal node
          type: "mealNode",
          data: { label: meal.strMeal, idMeal: meal.idMeal }, // Meal name as label
          position: { x: 900, y: -200 + index * 100 }, // Position below the "View Meals" node
        }));

        // Create edges from "View Meals" node to meal nodes
        const newMealEdges = meals.map((meal: any, index: number) => ({
          id: `e-${viewMealsNodeId}-${index + 2}`,
          source: viewMealsNodeId, // "View Meals" node
          target: `${viewMealsNodeId}-${meal.idMeal}`, // Each meal node
          type: "default", // Green edges for meals
        }));

        // Add meal nodes and edges to the state
        setNodes((nds) => nds.concat(newMealNodes));
        setEdges((eds) => eds.concat(newMealEdges));
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    },
    []
  );

  const addMealOptions = useCallback((mealNodeId: string) => {
    const options = ["View Ingredients", "View Tags", "View Details"];

    // Create option nodes
    const optionNodes = options.map((option, index) => ({
      id: `${mealNodeId}-${option}`,
      type: "optionNode",
      data: { label: option },
      position: { x: 1300, y: -200 + index * 100 }, // Adjust position below the meal node
    }));

    // Create edges from the meal node to the option nodes
    const optionEdges = options.map((option, index) => ({
      id: `e-${mealNodeId}-${option}`,
      source: mealNodeId, // Meal node
      target: `${mealNodeId}-${option}`, // Each option node
      type: "default", // Purple edges for options
    }));

    // Add option nodes and edges to the state
    setNodes((nds) => nds.concat(optionNodes));
    setEdges((eds) => eds.concat(optionEdges));
  }, []);

  const fetchIngredients = useCallback(
    async (mealNodeId: string, idMeal: string) => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
        );
        const meal = response.data.meals[0];

        // Extract ingredients from the meal
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          if (ingredient) {
            ingredients.push(ingredient);
          }
        }

        // Create nodes for each ingredient
        const ingredientNodes = ingredients.map(
          (ingredient: string, index: number) => ({
            id: `${mealNodeId}-ingredient-${index + 1}`,
            type: "ingredientTagNode",
            data: { label: ingredient },
            position: { x: 1650, y: -200 + index * 100 },
          })
        );

        // Create edges for each ingredient node
        const ingredientEdges = ingredients.map(
          (ingredient: string, index: number) => ({
            id: `e-${mealNodeId}-ingredient-${index + 1}`,
            source: `${mealNodeId}`,
            target: `${mealNodeId}-ingredient-${index + 1}`,
            type: "default",
          })
        );

        setNodes((nds) => nds.concat(ingredientNodes));
        setEdges((eds) => eds.concat(ingredientEdges));
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    },
    []
  );

  const fetchTags = useCallback(async (mealNodeId: string, idMeal: string) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const meal = response.data.meals[0];

      // Extract tags from the meal (assuming the tags are in `strTags` as a comma-separated string)
      const tags = meal.strTags ? meal.strTags.split(",") : [];

      // Create nodes for each tag
      const tagNodes = tags.map((tag: string, index: number) => ({
        id: `${mealNodeId}-tag-${index + 1}`,
        type: "ingredientTagNode",
        data: { label: tag },
        position: { x: 1650, y: -200 + index * 100 },
      }));

      // Create edges for each tag node
      const tagEdges = tags.map((tag: string, index: number) => ({
        id: `e-${mealNodeId}-tag-${index + 1}`,
        source: `${mealNodeId}`,
        target: `${mealNodeId}-tag-${index + 1}`,
        type: "default",
      }));

      setNodes((nds) => nds.concat(tagNodes));
      setEdges((eds) => eds.concat(tagEdges));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, []);

  // Handle node click event
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log(node.id);
      if (node.id.endsWith("-View Details")) {
        // Open the sidebar when the Meal Details node is clicked
        const mealId = node.id.split("-")[4];
        setSelectedMealId(mealId);
        setIsSidebarOpen(true);
        return;
      }
      if (node.id.includes("ingredient-")) {
        return; // Do nothing for ingredient nodes
      }
      if (node.id.includes("tag-")) {
        return; // Do nothing for ingredient nodes
      }
      if (node.id === "1") {
        // If the clicked node is the "Explore" node, fetch categories and create edges
        if (exploreclicked == false) {
          setexplorelicked(true);
          fetchCategories(node.id);
        }
      } else if (node.id.endsWith("-View Tags")) {
        // Fetch tags if the "Tags" node is clicked
        if (itclicked == false) {
          const mealId = node.id.split("-")[4]; // Extract meal ID
          fetchTags(node.id, mealId);
          setitclicked(true);
        }
      } else if (node.id.endsWith("-View Ingredients")) {
        // Fetch ingredients if the "Ingredients" node is clicked
        if (itclicked == false) {
          const mealId = node.id.split("-")[4]; // Extract meal ID
          console.log(mealId);
          fetchIngredients(node.id, mealId);
          setitclicked(true);
        }
      } else if (node.id.includes("view-meals-")) {
        // If a meal node is clicked, add options for Ingredients, Tags, and Meal Details
        if (mealClicked == false) {
          setMealClicked(true);
          addMealOptions(node.id);
        }
      } else if (node.id.endsWith("view-meals")) {
        // If "View Meals" node is clicked, fetch the top 5 meals for the category
        const category = nodes.find((n) => n.id === categoryClicked)?.data
          .label;
        console.log(category);
        if (category) {
          fetchMeals(node.id, category);
        }
      } else if (node.id.startsWith("1-")) {
        // If a category node is clicked, add "View Meals" node
        if (categoryClicked == null) {
          addViewMealsNode(node.id);
        }
      }
    },
    [
      fetchCategories,
      addViewMealsNode,
      fetchMeals,
      addMealOptions,
      fetchIngredients,
      fetchTags,
      categoryClicked,
      nodes,
    ]
  );

  return (
    <div className="h-screen w-full bg-gray-100">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        idMeal={selectedMealId || ""}
      />
    </div>
  );
};

export default FoodExplorer;
