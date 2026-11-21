import { CategoryPage, categoryMetadata } from "@/components/category/category-page";

export const metadata = categoryMetadata("arcade");

export default function Page() {
  return <CategoryPage type="arcade" />;
}
