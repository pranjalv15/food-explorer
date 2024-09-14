import React from "react";
import { Handle, Position } from "reactflow";
import { FaLeaf } from "react-icons/fa"; // Import the icon

const EntityNode = ({ data }: any) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex items-center min-w-52">
      <FaLeaf className="text-red-500 mr-2" /> {/* Icon */}
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

export default EntityNode;
