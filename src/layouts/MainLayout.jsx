import React from "react";
import HRLayout from "./HRLayout";

export default function MainLayout({
  children,
  title = "HR Portal",
  breadcrumb = "HR",
}) {
  return (
    <HRLayout title={title} breadcrumb={breadcrumb}>
      {children}
    </HRLayout>
  );
}