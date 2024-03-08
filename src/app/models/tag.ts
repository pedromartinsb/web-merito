export interface Tag {
    id?: string;
    name: string;
    description: string;
    class: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  }

  export interface monthlyTag {
    tag: string;
    date: string;
  }