import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type UserProfile = {
  full_name: string;
  email: string;
  avatar: string;
  age: number;
  address: string;
  phone_number: string;
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfileName = async () => {
        
      const { data, error } = await createClient().auth.getSession();

      if (error) {
        console.error(error);
      }

      setUser({
        full_name: data.session?.user.user_metadata.full_name ?? "Hassan Ali",
        email: data.session?.user.email ?? "?",
        avatar: data.session?.user.user_metadata.avatar ?? "",
        age: data.session?.user.user_metadata.age ?? 0,
        address: data.session?.user.user_metadata.address ?? "",
        phone_number: data.session?.user.user_metadata.phone_number ?? "",
      });
    };

    fetchProfileName();
  }, []);

  return user;
};
