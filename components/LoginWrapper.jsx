import dynamic from "next/dynamic";
import { Suspense } from "react";

const LoginWrapper = () => {
  const SocialLoginDynamic = dynamic(
    () => import("./Login").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginDynamic />
      </Suspense>
    </div>
  );
};

export default LoginWrapper;