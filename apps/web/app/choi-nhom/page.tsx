import { CategoryPage, categoryMetadata } from "@/components/category/category-page";

export const metadata = categoryMetadata("party");

export default function Page() {
  return <CategoryPage type="party" />;
}
