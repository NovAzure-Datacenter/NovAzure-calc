export interface Product {
  id: string;
  name: string;
  description?: string;
}

export interface Solution {
  id: string;
  name: string;
  description?: string;
  products: Product[];
}

export interface Technology {
  id: string;
  name: string;
  description?: string;
  solutions: Solution[];
}

export interface Industry {
  id: string;
  name: string;
  description?: string;
  technologies: Technology[];
}


export type IndustryData = Record<string, Industry>;