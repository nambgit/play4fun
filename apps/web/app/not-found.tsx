import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="bg-gradient-to-r from-brand to-arcade bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold">Game over… trang này không tồn tại</h1>
        <p className="mt-2 text-muted">Có thể đường dẫn đã thay đổi. Quay lại sảnh chờ để chọn game khác nhé.</p>
        <Link href="/" className="btn-primary mt-8">
          <Home className="h-4 w-4" aria-hidden="true" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
