import React from "react";
import { Handle, Position } from "reactflow";
import { FaBullseye } from "react-icons/fa";

const MealNode = ({ data }: any) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex items-center min-w-52">
      <FaBullseye className="text-blue-500 mr-2" />
      <span className="text-lg font-semibold">{data.label}</span> {/* Text */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-transparent"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-transparent"
      />
    </div>
  );
};

export default MealNode;
