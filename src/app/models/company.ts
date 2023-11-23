export interface Company {
  id?: string;
  name: string;
  companyType: string;

  holding: any;
  departments: any;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
