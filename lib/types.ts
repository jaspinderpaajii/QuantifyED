export type ResourceType = "PDF" | "VIDEO";
export type Visibility = "PUBLIC" | "DRAFT";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ResourceRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  categoryId: string;
  resourceType: ResourceType;
  visibility: Visibility;
  featured: boolean;
  exam: string;
  level: string;
  tags: string[];
  author: string;
  fileUrl: string | null;
  videoUrl: string | null;
  pageCount: number | null;
  duration: string | null;
  coverImage: string | null;
  downloads: number;
  createdAt: string;
  updatedAt: string;
};

export type StudentRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type SavedResourceRecord = {
  id: string;
  studentId: string;
  resourceId: string;
  createdAt: string;
};

export type StoreSnapshot = {
  homepage?: HomepageContent;
  categories: CategoryRecord[];
  resources: ResourceRecord[];
  students?: StudentRecord[];
  savedResources?: SavedResourceRecord[];
};

export type Category = CategoryRecord & {
  resourceCount: number;
};

export type Resource = ResourceRecord & {
  category: CategoryRecord;
};

export type StudentAccount = Omit<StudentRecord, "passwordHash">;

export type HomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  searchPlaceholder: string;
  categoriesEyebrow: string;
  categoriesTitle: string;
  categoriesDescription: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredDescription: string;
  valueEyebrow: string;
  valueTitle: string;
  valueDescription: string;
  flowEyebrow: string;
  flowTitle: string;
};

export type DashboardStats = {
  totalResources: number;
  totalCategories: number;
  featuredResources: number;
  totalDownloads: number;
  latestUpload: string | null;
};

export type CreateCategoryInput = {
  name: string;
  description: string;
  accent: string;
  featured: boolean;
};

export type CreateResourceInput = {
  title: string;
  summary: string;
  description: string;
  categoryId: string;
  resourceType: ResourceType;
  visibility: Visibility;
  featured: boolean;
  exam: string;
  level: string;
  tags: string[];
  author: string;
  fileUrl: string | null;
  videoUrl: string | null;
  pageCount: number | null;
  duration: string | null;
};

export type UpdateResourceInput = CreateResourceInput;

export type UpdateHomepageInput = HomepageContent;

export type CreateStudentInput = {
  name: string;
  email: string;
  passwordHash: string;
};
