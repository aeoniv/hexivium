import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-4">
      <Button asChild variant="outline" size="icon">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Home</span>
        </Link>
      </Button>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
    </header>
  );
}
