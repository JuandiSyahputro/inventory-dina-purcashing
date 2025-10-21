"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const NavBreadcrumb = () => {
  const pathname = usePathname();
  const arrayPathname = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {arrayPathname.map((item, index) => {
          const href = "/" + arrayPathname.slice(0, index + 1).join("/");
          const isLast = index === arrayPathname.length - 1;
          const isSecond = index === 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="hover:text-foreground transition-colors capitalize">{item}</BreadcrumbPage>
                ) : isSecond && arrayPathname.includes("product") ? (
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard/product/overview" className="capitalize hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavBreadcrumb;
