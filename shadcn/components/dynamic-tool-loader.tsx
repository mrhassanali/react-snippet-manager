"use client";

import dynamic from "next/dynamic";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AI_TOOLS_URL } from "@/constants/route-links";

type DynamicToolLoaderProps = {
  componentName: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentProps?: Record<string, any>;
};

export default function DynamicToolLoader({ componentName, componentProps = {} }: DynamicToolLoaderProps) {
  const DynamicComponent = dynamic(
    () =>
      import(`@/components/features/ai-tools/tool/${componentName}`).catch((err) => {
        console.error(`Failed to load component: ${componentName}`, err);
        return {
          default: () => (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-500/50 bg-red-500/10 p-8">
              <AlertCircle className="h-12 w-12 text-red-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Component Not Found</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Please ensure the component is registered in the tool registry.
                </p>
                <Button asChild variant="destructive" className="mt-4">
                  <Link href={AI_TOOLS_URL}>Back to AI Tools</Link>
                </Button>
              </div>
            </div>
          ),
        };
      }),
    {
      loading: () => (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ),
      ssr: false, // Set to false since this needs to run on client for dynamic imports
    },
  );

  return (
    <>
      <DynamicComponent {...componentProps} />
    </>
  );
}

// "use client";

// import React, { useEffect, useState, ComponentType } from "react";
// import { Loader2 } from "lucide-react";
// import { useMounted } from "@/hooks/use-mounted";

// type DynamicToolLoaderProps = {
//   componentName: string;
//   componentProps?: Record<string, any>;
// };

// export default function DynamicToolLoader({ componentName, componentProps = {} }: DynamicToolLoaderProps) {
//   const [Component, setComponent] = useState<ComponentType<any> | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const isMounted = useMounted();

//   useEffect(() => {
//     const loadComponent = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         if (!isMounted) return;
//         const module = await import(`@/components/features/ai-tools/tool/${componentName}`);
//         setComponent(() => module.default);
//       } catch (err) {
//         setError(`Failed to load component: ${componentName}`);
//         console.error("Component loading error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadComponent();
//   }, [componentName, path,isMounted]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <Loader2 className="text-primary h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   if (!Component) {
//     return null;
//   }

//     return <Component {...componentProps} />;
// }
