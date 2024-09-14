import React from "react";
import { Handle, Position } from "reactflow";
import { TiArrowForward } from "react-icons/ti";

const OptionNode = ({ data }: any) => {
  return (
    <div className="bg-white text-gray-500 shadow-md rounded-2xl p-4 border border-gray-300 flex items-center min-w-52 h-6">
      <TiArrowForward className="text-green-500 mr-2" />
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

export default OptionNode;
