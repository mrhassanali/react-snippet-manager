"use client";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BreadCrumb: React.FC = () => {
  const path = usePathname();
  const pathName = path.split("/").filter((p) => p !== "");

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathName.length > 0 && (
            <BreadcrumbSeparator className="hidden md:block" />
          )}

          {pathName.map((link, index) => {
            const href = `/${pathName.slice(0, index + 1).join("/")}`;
            const linkName = link.charAt(0).toUpperCase() + link.slice(1);
            const isLastPath = index === pathName.length - 1;

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isLastPath ? (
                    <BreadcrumbPage>{linkName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{linkName}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLastPath && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BreadCrumb;
