import DarkVeil from "@/components/dark-veil";
import { LoginForm } from "@/components/auth/login-form";
import ShinyText from "@/components/shiny-text";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="absolute z-10 flex flex-col w-full gap-4 p-2 -translate-x-1/2 -translate-y-1/2 lg:pb-4 md:p-10 lg:relative top-1/2 left-1/2">
        <div className="flex items-center justify-center flex-1 p-5 rounded-lg max-lg:bg-gray-500/50 backdrop-blur-2xl">
          <div className="w-full max-w-xs lg:max-w-xs md:max-w-xl ">
            <LoginForm />
          </div>
        </div>
        <div className="hidden w-full mt-2 text-xs text-center text-gray-500 lg:block">
          &copy; {new Date().getFullYear()} <b className="text-custom-primary-dark">Dina Purchasing.</b> All rights reserved.
        </div>
      </div>
      <div className="absolute z-10 w-full mt-2 text-xs text-center text-gray-500 bottom-5 lg:hidden">
        &copy; {new Date().getFullYear()} <b className="text-custom-primary-dark">Dina Purchasing.</b> All rights reserved.
      </div>
      <div className="relative">
        <DarkVeil speed={2} />
        <div className="absolute hidden px-8 text-center -translate-x-1/2 -translate-y-1/2 lg:block top-1/2 left-1/2">
          {/* <h2 className="text-4xl font-bold text-white drop-shadow-lg">Smart Inventory Management</h2> */}
          <ShinyText text="Smart Inventory Management" speed={3} className="text-4xl font-bold drop-shadow-lg" />
          <p className="max-w-md mx-auto mt-4 text-lg text-gray-300">Track, manage, and optimize your inventory seamlessly in one platform.</p>
        </div>
      </div>
    </div>
  );
}
