import React, { useEffect, useState } from "react";
import axios from "axios";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  idMeal: string; // Accept idMeal as a prop
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, idMeal }) => {
  const [meal, setMeal] = useState<any | null>(null); // Store the full meal object

  // Fetch meal details based on idMeal
  useEffect(() => {
    if (isOpen && idMeal) {
      const fetchMealDetails = async () => {
        try {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
          );
          const mealData = response.data.meals[0];
          setMeal(mealData); // Store full meal object
        } catch (error) {
          console.error("Error fetching meal details:", error);
        }
      };

      fetchMealDetails();
    }
  }, [isOpen, idMeal]);

  if (!isOpen || !meal) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg z-50 overflow-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-600 mb-2 text-left">
          {meal.strMeal}
        </h2>

        <button
          className="absolute top-4 right-4 text-2xl font-semibold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <hr className="h-px mt-4 mb-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        {/* Meal Image */}
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-60 object-cover mb-4"
        />

        {/* Meal Name */}

        {/* Tags */}
        <div className="flex flex-wrap space-x-2 mb-4">
          {meal.strTags &&
            meal.strTags.split(",").map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-yellow-100 text-gray-600 rounded-full text-xs font-semibold border-solid border-2 border-yellow-700"
              >
                {tag}
              </span>
            ))}
        </div>

        {/* Category, Area, YouTube, Recipe */}
        <div className="mb-4 text-left text-semibold">
          {/* Category and Area */}
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm font-semibold text-gray-500">Category</p>
            <p className="text-sm">{meal.strCategory}</p>

            <p className="text-sm font-semibold text-gray-500">Area</p>
            <p className="text-sm">{meal.strArea}</p>
          </div>

          {/* YouTube */}
          {meal.strYoutube && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p className="text-sm font-semibold text-gray-500">YouTube</p>
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {meal.strYoutube}
              </a>
            </div>
          )}

          {/* Recipe */}
          {meal.strSource && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p className="text-sm font-semibold text-gray-500">Recipe</p>
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {meal.strSource}
              </a>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 text-left border-solid border-2">
          <h3 className="font-bold text-gray-700 mb-2">Instructions</h3>
          <p className="text-sm text-gray-600">{meal.strInstructions}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
