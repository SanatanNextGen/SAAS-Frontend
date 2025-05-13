import { Metadata } from "next";
import { title } from "process";
import React from "react";

interface MetaDataProps {
  title: string;
  description: string;
}

const MetaDataCompnent = (title: string, description: string): Metadata => ({
  title: title || "Sanatan Digital Solution",
  description: description || "Sanatan Digital Solution",
});

export default MetaDataCompnent;
